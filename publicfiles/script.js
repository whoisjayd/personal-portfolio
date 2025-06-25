
// Global portfolio data
let portfolioData = null;

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
        console.warn('Invalid date format:', dateString, error);
        return 'N/A';
    }
};

const showError = (message) => {
    const loading = document.getElementById('loading');
    loading.innerHTML = `<div class="error-message">Error: ${message}</div>`;
};

const hideLoading = () => {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    document.getElementById('footer').classList.remove('hidden');
    document.getElementById('dock-container').classList.remove('hidden');
};
window.addEventListener('scroll', () => {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.setProperty('--scroll-width', `${scrolled}%`);
});

// Update CSS variable for scroll progress
document.querySelector('.scroll-progress').style.setProperty('--scroll-width', '0%');
// Load and parse portfolio data
async function loadPortfolioData() {
    try {
        const response = await fetch('portfolio-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Validate required fields
        if (!data.personal?.githubUsername) {
            throw new Error('Missing githubUsername in portfolio-data.json');
        }
        return data;
    } catch (error) {
        console.error('Failed to load portfolio data:', error);
        showError('Failed to load portfolio data. Please try again later.');
        throw error;
    }
}

// Load project overrides from JSON
async function loadProjectOverrides() {
    try {
        const response = await fetch('project-overrides.json');
        if (!response.ok) {
            console.warn('Project overrides not found, proceeding without overrides.');
            return { projects: [], hiddenProjects: [] };
        }
        const overrides = await response.json();
        return {
            projects: overrides.projects || [],
            hiddenProjects: overrides.hiddenProjects || []
        };
    } catch (error) {
        console.warn('Failed to load project overrides:', error);
        return { projects: [], hiddenProjects: [] };
    }
}

// Fetch projects from GitHub API
async function fetchGitHubProjects(username, token = null) {
    try {
        const headers = token ? { Authorization: `token ${token}` } : {};
        const response = await fetch(`https://api.github.com/users/${username}/repos`, { headers });
        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('GitHub API rate limit exceeded. Please try again later or provide a valid token.');
            }
            throw new Error(`GitHub API error! status: ${response.status}`);
        }
        const repos = await response.json();
        return repos.map(repo => ({
            name: repo.name,
            description: repo.description || '',
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            githubUrl: repo.html_url,
            liveUrl: repo.homepage || null,
            technologies: repo.topics || [],
            featured: false,
            thumbnail: null,
            fork: repo.fork
        }));
    } catch (error) {
        console.error('Failed to fetch GitHub projects:', error);
        showError(error.message);
        return [];
    }
}

// Merge GitHub projects with overrides and filter out hidden/forked projects
function mergeProjects(githubProjects, overrides, hideForks) {
    const overrideMap = new Map(overrides.projects.map(p => [p.name, p]));
    const hiddenSet = new Set(overrides.hiddenProjects);
    return githubProjects
        .filter(project =>
            !hiddenSet.has(project.name) &&
            (!hideForks || !project.fork) &&
            (!overrides.hideArchived || !project.archived)
        )
        .map(project => {
            const override = overrideMap.get(project.name) || {};
            return {
                ...project,
                description: override.description || project.description,
                liveUrl: override.liveUrl || project.liveUrl,
                technologies: override.technologies || project.technologies,
                featured: override.featured !== undefined ? override.featured : project.featured,
            };
        });
}

// Render personal information
function renderPersonalInfo(personalData) {
    const mainTitle = document.getElementById('main-title');
    mainTitle.innerHTML = `
                ${personalData.title || 'Software Developer'} <br>
                <span style="
                    position: relative;
                    display: inline-block;
                ">
                    <span style="
                        position: absolute;
                        inset: 0;
                        z-index: 0;
                        background: rgb(255, 255, 255);
                        border-radius: 6px;
                        pointer-events: none;
                    "></span>
                    <span style="
                        position: relative;
                        z-index: 1;
                        background: url('https://www.netanimations.net/Animated-clip-art-picture-of-blue-fire-flames.gif') center center / cover no-repeat, rgb(0, 0, 0);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        color: transparent;
                        display: inline-block;
                        animation: animated-gif-bg 8s linear infinite alternate;
                        padding: 0 2px;
                    ">
                        ${personalData.name || 'Jaydeep Solanki'}
                    </span>
                </span>
                <style>
                    @keyframes animated-gif-bg {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 100% 50%; }
                    }
                </style>
            `;

    document.getElementById('bio-text').innerHTML = personalData.bio || '';
    document.getElementById('profile-image').src = personalData.profileImage || '/placeholder.svg';
    document.getElementById('profile-image').alt = `${personalData.name || 'Profile'} Picture`;

    const emailLink = document.getElementById('email-link');
    emailLink.href = `mailto:${personalData.email || ''}`;
    emailLink.textContent = personalData.email || 'N/A';
}

// Render social links
function renderSocialLinks(socialLinks) {
    const container = document.getElementById('social-links');
    container.innerHTML = (socialLinks || []).map(link => `
                <a class="social" target="_blank" href="${link.url || '#'}" aria-label="${link.name || 'Social Link'}">
                    <img src="${link.icon || '/placeholder.svg'}" class="social-icon" ${link.name === 'LinkedIn' || link.name === 'YouTube' || link.name === 'Resume' ? 'style="filter: invert(1);"' : ''} alt="${link.name || 'Social'} icon">
                    ${link.name || 'Link'}
                    <img src="asset/logos/openlink.svg" class="openlink" alt="External link">
                </a>
            `).join('');
}

function renderSkills(skills) {
    const scn = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(75, 1, 0.1, 1e3);
    const rndr = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const grp = new THREE.Group();
    const ldr = new THREE.TextureLoader();
    const sps = [];
    const r = 27;
    const s = 6;
    const c = document.querySelector('.skill-tag-cloud');

    // Create container and tooltip
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.background = 'rgba(0, 0, 0, 0.9)';
    container.style.padding = '15px';
    container.style.borderRadius = '8px';
    container.style.margin = '10px';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    container.style.zIndex = '1000';
    document.body.appendChild(container);

    const tooltip = document.createElement('div');
    tooltip.style.color = 'white';
    tooltip.style.fontSize = '14px';
    tooltip.style.display = 'none';
    container.appendChild(tooltip);

    rndr.setSize(375, 375);
    c.appendChild(rndr.domElement);
    rndr.setClearColor(0x000000, 0);

    let hoveredSprite = null;
    let selectedSprite = null;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let autoRotate = true;

    (skills || []).forEach((skill, i) => {
        ldr.load(skill.icon || '/placeholder.svg', t => {
            const phi = Math.acos(-1 + 2 * i / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;
            const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t }));
            sp.scale.set(s, s, 1);
            sp.position.set(
                r * Math.cos(theta) * Math.sin(phi),
                r * Math.sin(theta) * Math.sin(phi),
                r * Math.cos(phi)
            );
            sp.userData = {
                name: skill.name || 'Skill',
                category: skill.category || 'General',
                originalScale: s
            };
            grp.add(sp);
            sps.push(sp);
        }, undefined, error => {
            console.warn(`Failed to load skill icon: ${skill.icon}`, error);
        });
    });

    scn.add(grp);
    cam.position.z = 50;

    const ry = new THREE.Raycaster();
    let canvasRect = rndr.domElement.getBoundingClientRect();

    function updateCanvasRect() {
        canvasRect = rndr.domElement.getBoundingClientRect();
    }

    window.addEventListener('scroll', updateCanvasRect);
    window.addEventListener('resize', updateCanvasRect);

    window.addEventListener('dblclick', e => {
        if (e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
            e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom) {
            autoRotate = !autoRotate;
            if (selectedSprite) {
                selectedSprite = null;
                gsap.to(cam.position, {
                    x: 0,
                    y: 0,
                    z: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                sps.forEach(sp => {
                    gsap.to(sp.scale, {
                        x: sp.userData.originalScale,
                        y: sp.userData.originalScale,
                        duration: 0.3
                    });
                });
            }
        }
    });

    window.addEventListener('mousedown', e => {
        if (e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
            e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom) {
            isDragging = true;
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
            ry.setFromCamera({
                x: 2 * (e.clientX - canvasRect.left) / 375 - 1,
                y: 2 * -(e.clientY - canvasRect.top) / 375 + 1
            }, cam);
            const it = ry.intersectObjects(sps)[0];
            if (it) {
                selectedSprite = it.object;
                autoRotate = false;
                const targetPos = it.object.position.clone().normalize().multiplyScalar(20);
                gsap.to(cam.position, {
                    x: targetPos.x,
                    y: targetPos.y,
                    z: targetPos.z,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                gsap.to(it.object.scale, {
                    x: s * 1.5,
                    y: s * 1.5,
                    duration: 0.3
                });
            } else if (selectedSprite) {
                selectedSprite = null;
                gsap.to(cam.position, {
                    x: 0,
                    y: 0,
                    z: 50,
                    duration: 0.5,
                    ease: 'power2.out'
                });
                sps.forEach(sp => {
                    gsap.to(sp.scale, {
                        x: sp.userData.originalScale,
                        y: sp.userData.originalScale,
                        duration: 0.3
                    });
                });
            }
        }
    });

    window.addEventListener('mousemove', e => {
        if (e.clientX >= canvasRect.left && e.clientX <= canvasRect.right &&
            e.clientY >= canvasRect.top && e.clientY <= canvasRect.bottom) {
            const mouse = {
                x: 2 * (e.clientX - canvasRect.left) / 375 - 1,
                y: 2 * -(e.clientY - canvasRect.top) / 375 + 1
            };
            ry.setFromCamera(mouse, cam);
            const intersects = ry.intersectObjects(sps);

            if (hoveredSprite) {
                gsap.to(hoveredSprite.scale, {
                    x: hoveredSprite.userData.originalScale,
                    y: hoveredSprite.userData.originalScale,
                    duration: 0.2
                });
                hoveredSprite = null;
                tooltip.style.display = 'none';
            }

            if (intersects.length > 0) {
                hoveredSprite = intersects[0].object;
                gsap.to(hoveredSprite.scale, {
                    x: hoveredSprite.userData.originalScale * 1.2,
                    y: hoveredSprite.userData.originalScale * 1.2,
                    duration: 0.2
                });
                tooltip.style.display = 'block';
                tooltip.innerHTML = `<strong>${hoveredSprite.userData.name}</strong><br>${hoveredSprite.userData.category}`;
            }

            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                const deltaY = e.clientY - previousMouseY;
                grp.rotation.y += deltaX * 0.005;
                grp.rotation.x += deltaY * 0.005;
                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
            }
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function animate() {
        requestAnimationFrame(animate);

        if (autoRotate && !selectedSprite) {
            grp.rotation.y += 0.005;
        }

        grp.children.forEach(s => s.lookAt(cam.position));
        rndr.render(scn, cam);
    }
    animate();
}

// Render experience
function renderExperience(experiences) {
    const container = document.getElementById('experience-container');
    container.innerHTML = (experiences || []).map(exp => `
                <div class="exp-card" onclick="${exp.companyUrl ? `window.open('${exp.companyUrl}', '_blank')` : ''}" 
                     style="cursor: ${exp.companyUrl ? 'pointer' : 'default'}">
                    <div class="card-header-grid">
                        <img src="${exp.logo || '/placeholder.svg'}" alt="${exp.company || 'Company'} logo" class="compamylogo" 
                             style="${exp.logoStyle || ''}" loading="lazy">
                        
                        <div class="card-header-text">
                            <h3>${exp.company || 'Unknown Company'}</h3>
                            <p>${exp.role || 'Role'} | ${exp.date || 'N/A'}</p>
                        </div>
                        ${exp.companyUrl ? `
                        <div style="height: 100%; display: flex; align-items: flex-start; justify-content: right;">
                            <img src="asset/logos/openlink.svg" alt="Open link" class="redirection-logo">
                        </div>
                        ` : '<div></div>'}
                        <div></div>
                        ${exp.description ? `
                        <ul>
                            ${exp.description.map(point => `<li>${point}</li>`).join('')}
                        </ul>
                        ` : ''}
                    </div>
                    ${exp.skills ? `
                    <div class="skill-cards">
                        ${exp.skills.map(skill => `<div class="skill-card">${skill}</div>`).join('')}
                    </div>
                    ` : ''}
                </div>
            `).join('');
}

// Render extra-curriculars
function renderExtracuriculars(extracuriculars) {
    const container = document.getElementById('extra-curricular-container');
    container.innerHTML = (extracuriculars || []).map(item => `
                <div class="exp-card" onclick="${item.url ? `window.open('${item.url}', '_blank')` : ''}" 
                    style="cursor: ${item.url ? 'pointer' : 'default'}">
                    <div class="card-header-grid">
                        <div>
                            ${item.logo ? `<img src="${item.logo}" alt="${item.title || 'Activity'} logo" class="compamylogo" style="${item.logoStyle || ''}" loading="lazy">` : ''}
                        </div>

                        <div class="card-header-text">
                            <h3>${item.title || 'Activity'}</h3>
                            <p>${item.date || 'N/A'}</p>
                        </div>

                        ${item.url ? `
                        <div style="height: 100%; display: flex; align-items: flex-start; justify-content: right;">
                            <img src="asset/logos/openlink.svg" alt="Open link" class="redirection-logo">
                        </div>` : '<div></div>'}

                        <div></div>

                        ${item.description ? `
                        <ul>
                            <li>${item.description}</li>
                        </ul>` : ''}
                    </div>
                </div>
            `).join('');
}

// Render projects
function renderProjects(projects) {
    const container = document.getElementById('projects-container');
    const sortedProjects = (projects || [])
        .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        .slice(0, 4);

    container.innerHTML = sortedProjects.map(project => `
                <div class="pro-card" onclick="window.open('${project.githubUrl || '#'}', '_blank')" 
                     aria-label="View ${project.name || 'Project'} project">
                    <div class="pro-card-header">
                        <div class="pro-card-title">
                            <h3>${project.name || 'Unnamed Project'}</h3>
                        </div>
                        <p>${project.description || 'No description available.'}</p>
                    </div>
                    <div class="pro-card-body">
                        <div class="skill-cards">
                            ${(project.technologies || []).slice(0, 7).map(tech => `<div class="skill-card">${tech}</div>`).join('')}
                        </div>
                        <div class="pro-card-links">
                            <a href="${project.githubUrl || '#'}" target="_blank" onclick="event.stopPropagation()">GitHub</a>
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" onclick="event.stopPropagation()">Live Demo</a>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
}

// Render certificates
function renderCertificates(certificates) {
    const container = document.getElementById('certificates-container');
    container.innerHTML = (certificates || []).map(cert => `
                <div class="certificate-card" style="background-image: url(${cert.image || '/placeholder.svg'})" 
                     aria-label="${cert.title || 'Certificate'} certificate">
                    <div class="certificate-card-content">
                        <h2>${cert.title || 'Certificate'}</h2>
                        <div class="certificate-card-content-bottom">
                            <p>${cert.date || 'N/A'}<br>Credential ID: ${cert.credentialId || 'N/A'}</p>
                            <a href="${cert.viewUrl || '#'}" target="_blank" 
                               aria-label="View ${cert.title || 'certificate'} details">View</a>
                        </div>
                    </div>
                </div>
            `).join('');
}

// Render navigation dock
function renderNavigation(navItems) {
    const container = document.getElementById('dock-items');
    container.innerHTML = (navItems || []).map((item, index) => `
                <a href="#${item.section || ''}" class="item ${index === 0 ? 'active' : ''}" 
                   data-vel-view="item" data-tooltip="${item.label || 'Section'}" 
                   aria-label="Navigate to ${item.label || 'Section'}">
                    <img src="${item.icon || '/placeholder.svg'}" alt="${item.label || 'Section'} icon">
                </a>
            `).join('');
}

// Initialize dock functionality
function initializeDock() {
    const { createApp, Events, Utils } = Veloxi;

    const MacOsDockPlugin = (context) => {
        let items, root;

        context.subscribeToEvents((eventBus) => {
            eventBus.subscribeToEvent(Events.PointerMoveEvent, onMouseMove);
        });

        function onMouseMove(event) {
            if (!root.intersects(event.x, event.y)) {
                items.forEach((item) => {
                    item.size.reset();
                });
                return;
            }
            items.forEach((item) => {
                const progress = Utils.pointToViewProgress(
                    { x: event.x, y: event.y },
                    item,
                    120
                );
                const scale = Utils.remap(progress, 0, 1, 1, 2);
                item.size.set({ width: 40 * scale, height: 40 * scale });
            });
        }

        context.setup(() => {
            root = context.getView('root');
            items = context.getViews('item');
            items.forEach((item) => {
                item.size.setAnimator('dynamic');
                item.origin.set({ x: 0.5, y: 1 });
            });
        });
    };

    MacOsDockPlugin.pluginName = 'MacOsDock';

    const app = createApp();
    app.addPlugin(MacOsDockPlugin);
    app.run();
}

// Initialize scroll-based dock highlighting
function initializeDockHighlighting() {
    const dockItems = document.querySelectorAll('.macos-dock .item');
    const sections = [
        document.getElementById('section1'),
        document.getElementById('section2'),
        document.getElementById('section6'),
        document.getElementById('section3'),
        document.getElementById('section5'),
        document.getElementById('section4')
    ].filter(Boolean);

    let lastActiveIndex = -1;
    let animationTimeout = null;

    function setActiveDockItem() {
        let found = false;
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom > 100) {
                if (lastActiveIndex !== i) {
                    dockItems.forEach(item => item.classList.remove('section-animate', 'active'));
                    dockItems[i].classList.add('active', 'section-animate');
                    if (animationTimeout) clearTimeout(animationTimeout);
                    animationTimeout = setTimeout(() => {
                        dockItems[i].classList.remove('section-animate');
                    }, 300);
                    lastActiveIndex = i;
                }
                found = true;
                break;
            }
        }
        if (!found) {
            dockItems.forEach(item => item.classList.remove('active', 'section-animate'));
            lastActiveIndex = -1;
        }
    }

    window.addEventListener('scroll', setActiveDockItem, { passive: true });
    window.addEventListener('resize', setActiveDockItem);
    setActiveDockItem();
}

// Initialize fade-in animations
function initializeFadeInAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    function observeNewDivs() {
        document.querySelectorAll("div:not(.certificate-card):not(.certificate-card-content):not(.certificate-card-content-bottom):not(.loading)").forEach((div) => {
            if (!div.classList.contains("fade-in")) {
                observer.observe(div);
            }
        });
    }

    observeNewDivs();

    const mutationObserver = new MutationObserver(() => observeNewDivs());
    mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// Initialize experience card animations
function initializeExperienceAnimations() {
    const cards = document.querySelectorAll('.exp-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    });

    cards.forEach((card) => {
        observer.observe(card);
    });
}

// Main initialization function
async function initializePortfolio() {
    try {
        const data = await loadPortfolioData();
        portfolioData = data;
        const overrides = await loadProjectOverrides();
        const githubProjects = await fetchGitHubProjects(data.personal.githubUsername, data.personal.githubToken);
        const mergedProjects = mergeProjects(githubProjects, overrides, data.personal.hideForks || false);

        // Render all sections
        renderPersonalInfo(data.personal || {});
        renderSocialLinks(data.socialLinks || []);
        renderSkills(data.skills || []);
        renderExperience(data.experience || []);
        renderExtracuriculars(data.extracuriculars || []);
        renderProjects(mergedProjects);
        renderCertificates(data.certificates || []);
        renderNavigation(data.navigation || []);

        // Hide loading and show content
        hideLoading();

        // Initialize interactive features
        setTimeout(() => {
            initializeDock();
            initializeDockHighlighting();
            initializeFadeInAnimations();
            initializeExperienceAnimations();
        }, 100);

    } catch (error) {
        console.error('Failed to initialize portfolio:', error);
        showError('Failed to initialize portfolio. Please check the console for details.');
    }
}

// Start the application
document.addEventListener('DOMContentLoaded', initializePortfolio);

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    if (portfolioData) {
        setTimeout(initializeDockHighlighting, 100);
    }
});