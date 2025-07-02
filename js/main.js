// Main Portfolio Application
class PortfolioApp {
  constructor() {
    this.isLoading = true
    this.scrollProgress = document.querySelector(".scroll-progress")
    this.loadingElement = document.getElementById("loading")
    this.mainContent = document.getElementById("main-content")
    this.dockContainer = document.getElementById("dock-container")
    this.portfolioData = window.portfolioData
    this.projectOverrides = window.projectOverrides
    this.THREE = window.THREE
    this.gsap = window.gsap
    this.Veloxi = window.Veloxi

    this.init()
  }

  async init() {
    try {
      // Initialize performance monitoring
      this.initializePerformanceMonitoring()
      this.initializeAdaptiveLoading()

      // Load and render portfolio data
      await this.loadPortfolioData()

      // Hide loading and show content
      this.hideLoading()

      // Initialize interactive features
      setTimeout(() => {
        this.initializeDock()
        this.initializeDockHighlighting()
        this.initializeFadeInAnimations()
        this.initializeExperienceAnimations()
        this.initializeScrollProgress()
      }, 100)
    } catch (error) {
      console.error("Failed to initialize portfolio:", error)
      this.showError("Failed to initialize portfolio. Please check the console for details.")
    }
  }

  async loadPortfolioData() {
    try {
      if (!this.portfolioData || !this.portfolioData.personal) {
        throw new Error("Portfolio data not found or invalid")
      }

      const githubProjects = await this.fetchGitHubProjects(this.portfolioData.personal.githubUsername)
      const mergedProjects = this.mergeProjects(
        githubProjects,
        this.projectOverrides,
        this.portfolioData.personal.hideForks || false,
      )

      // Render all sections
      this.renderPersonalInfo(this.portfolioData.personal || {})
      this.renderSocialLinks(this.portfolioData.socialLinks || [])
      this.renderSkills(this.portfolioData.skills || [])
      this.renderExperience(this.portfolioData.experience || [])
      this.renderExtracurriculars(this.portfolioData.extracurriculars || [])
      this.renderProjects(mergedProjects)
      this.renderCertificates(this.portfolioData.certificates || [])
      this.renderNavigation(this.portfolioData.navigation || [])
    } catch (error) {
      console.error("Failed to load portfolio data:", error)
      throw error
    }
  }

  async fetchGitHubProjects(username, token = null) {
    try {
      const headers = token ? { Authorization: `token ${token}` } : {}
      const response = await fetch(`https://api.github.com/users/${username}/repos`, { headers })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("GitHub API rate limit exceeded. Please try again later.")
        }
        throw new Error(`GitHub API error! status: ${response.status}`)
      }

      const repos = await response.json()
      return repos.map((repo) => ({
        name: repo.name,
        description: repo.description || "",
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || null,
        technologies: repo.topics || [],
        featured: false,
        thumbnail: null,
        fork: repo.fork,
      }))
    } catch (error) {
      console.error("Failed to fetch GitHub projects:", error)
      this.showError(error.message)
      return []
    }
  }

  mergeProjects(githubProjects, overrides, hideForks) {
    const overrideMap = new Map(overrides.projects.map((p) => [p.name, p]))
    const hiddenSet = new Set(overrides.hiddenProjects)

    return githubProjects
      .filter(
        (project) =>
          !hiddenSet.has(project.name) &&
          (!hideForks || !project.fork) &&
          (!overrides.hideArchived || !project.archived),
      )
      .map((project) => {
        const override = overrideMap.get(project.name) || {}
        return {
          ...project,
          description: override.description || project.description,
          liveUrl: override.liveUrl || project.liveUrl,
          technologies: override.technologies || project.technologies,
          featured: override.featured !== undefined ? override.featured : project.featured,
        }
      })
  }

  renderPersonalInfo(personalData) {
    const mainTitle = document.getElementById("main-title")
    mainTitle.innerHTML = `
            ${personalData.title || "Software Developer"} <br>
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
                    ${personalData.name || "Jaydeep Solanki"}
                </span>
            </span>
        `

    document.getElementById("bio-text").innerHTML = personalData.bio || ""
    document.getElementById("profile-image").src = personalData.profileImage || "/placeholder.svg"
    document.getElementById("profile-image").alt = `${personalData.name || "Profile"} Picture`

    const emailLink = document.getElementById("email-link")
    emailLink.href = `mailto:${personalData.email || ""}`
    emailLink.textContent = personalData.email || "N/A"
  }

  renderSocialLinks(socialLinks) {
    const container = document.getElementById("social-links")
    container.innerHTML = (socialLinks || [])
      .map(
        (link) => `
            <a class="social" target="_blank" href="${link.url || "#"}" aria-label="${link.name || "Social Link"}">
                <img src="${link.icon || "/placeholder.svg"}" class="social-icon" 
                     ${link.name === "LinkedIn" || link.name === "YouTube" || link.name === "Resume" ? 'style="filter: invert(1);"' : ""} 
                     alt="${link.name || "Social"} icon">
                ${link.name || "Link"}
                <img src="asset/logos/openlink.svg" class="openlink" alt="External link">
            </a>
        `,
      )
      .join("")
  }

  renderSkills(skills) {
    if (!this.THREE) {
      console.warn("Three.js not loaded, skipping 3D skills visualization")
      return
    }

    const scn = new this.THREE.Scene()
    const cam = new this.THREE.PerspectiveCamera(75, 1, 0.1, 1e3)
    const rndr = new this.THREE.WebGLRenderer({ antialias: true, alpha: true })
    const grp = new this.THREE.Group()
    const ldr = new this.THREE.TextureLoader()
    const sps = []
    const r = 27
    const s = 6
    const c = document.querySelector(".skill-tag-cloud")

    if (!c) return

    // Get container dimensions and make responsive
    const getContainerSize = () => {
      const containerWidth = c.clientWidth || window.innerWidth
      const containerHeight = c.clientHeight || window.innerHeight * 0.6
      const size = Math.min(containerWidth, containerHeight, 500)
      return { width: size, height: size }
    }

    let { width, height } = getContainerSize()

    // Create container and tooltip
    const container = document.createElement("div")
    container.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.9);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            max-width: calc(100vw - 40px);
            pointer-events: none;
        `
    c.appendChild(container)

    const tooltip = document.createElement("div")
    tooltip.style.cssText = `
            color: white;
            font-size: 12px;
            display: none;
            line-height: 1.4;
        `
    container.appendChild(tooltip)

    // Set initial renderer size
    rndr.setSize(width, height)
    rndr.domElement.style.cssText = `
            display: block;
            max-width: 100%;
            height: auto;
        `
    c.appendChild(rndr.domElement)
    rndr.setClearColor(0x000000, 0)

    // Update camera aspect ratio
    cam.aspect = width / height
    cam.updateProjectionMatrix()

    let hoveredSprite = null
    let selectedSprite = null
    let isDragging = false
    let previousX = 0
    let previousY = 0
    let autoRotate = true
    let lastTouchTime = 0

    // Handle resize
    const handleResize = () => {
      const newSize = getContainerSize()
      width = newSize.width
      height = newSize.height

      rndr.setSize(width, height)
      cam.aspect = width / height
      cam.updateProjectionMatrix()
      updateCanvasRect()
    }

    window.addEventListener("resize", handleResize)
    ;(skills || []).forEach((skill, i) => {
      ldr.load(
        skill.icon || "/placeholder.svg",
        (t) => {
          const phi = Math.acos(-1 + (2 * i) / skills.length)
          const theta = Math.sqrt(skills.length * Math.PI) * phi
          const sp = new this.THREE.Sprite(new this.THREE.SpriteMaterial({ map: t }))
          sp.scale.set(s, s, 1)
          sp.position.set(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi))
          sp.userData = {
            name: skill.name || "Skill",
            category: skill.category || "General",
            originalScale: s,
          }
          grp.add(sp)
          sps.push(sp)
        },
        undefined,
        (error) => {
          console.warn(`Failed to load skill icon: ${skill.icon}`, error)
        },
      )
    })

    scn.add(grp)
    cam.position.z = 50

    const ry = new this.THREE.Raycaster()
    let canvasRect = rndr.domElement.getBoundingClientRect()

    function updateCanvasRect() {
      canvasRect = rndr.domElement.getBoundingClientRect()
    }

    window.addEventListener("scroll", updateCanvasRect)

    // Get normalized coordinates for both mouse and touch
    function getNormalizedCoords(clientX, clientY) {
      return {
        x: (2 * (clientX - canvasRect.left)) / canvasRect.width - 1,
        y: (2 * -(clientY - canvasRect.top)) / canvasRect.height + 1,
      }
    }

    function isWithinCanvas(clientX, clientY) {
      return (
        clientX >= canvasRect.left &&
        clientX <= canvasRect.right &&
        clientY >= canvasRect.top &&
        clientY <= canvasRect.bottom
      )
    }

    const handleInteractionStart = (clientX, clientY) => {
      if (!isWithinCanvas(clientX, clientY)) return false

      isDragging = true
      previousX = clientX
      previousY = clientY

      const coords = getNormalizedCoords(clientX, clientY)
      ry.setFromCamera(coords, cam)
      const it = ry.intersectObjects(sps)[0]

      if (it) {
        selectedSprite = it.object
        autoRotate = false
        const targetPos = it.object.position.clone().normalize().multiplyScalar(20)

        if (this.gsap) {
          this.gsap.to(cam.position, {
            x: targetPos.x,
            y: targetPos.y,
            z: targetPos.z,
            duration: 0.5,
            ease: "power2.out",
          })
          this.gsap.to(it.object.scale, {
            x: s * 1.5,
            y: s * 1.5,
            duration: 0.3,
          })
        }
      } else if (selectedSprite) {
        selectedSprite = null
        if (this.gsap) {
          this.gsap.to(cam.position, {
            x: 0,
            y: 0,
            z: 50,
            duration: 0.5,
            ease: "power2.out",
          })
          sps.forEach((sp) => {
            this.gsap.to(sp.scale, {
              x: sp.userData.originalScale,
              y: sp.userData.originalScale,
              duration: 0.3,
            })
          })
        }
      }
      return true
    }

    const handleInteractionMove = (clientX, clientY) => {
      if (!isWithinCanvas(clientX, clientY)) return

      const coords = getNormalizedCoords(clientX, clientY)
      ry.setFromCamera(coords, cam)
      const intersects = ry.intersectObjects(sps)

      // Handle hover effects
      if (hoveredSprite && (!intersects.length || intersects[0].object !== hoveredSprite)) {
        if (this.gsap) {
          this.gsap.to(hoveredSprite.scale, {
            x: hoveredSprite.userData.originalScale,
            y: hoveredSprite.userData.originalScale,
            duration: 0.2,
          })
        }
        hoveredSprite = null
        tooltip.style.display = "none"
      }

      if (intersects.length > 0 && intersects[0].object !== hoveredSprite) {
        hoveredSprite = intersects[0].object
        if (this.gsap) {
          this.gsap.to(hoveredSprite.scale, {
            x: hoveredSprite.userData.originalScale * 1.2,
            y: hoveredSprite.userData.originalScale * 1.2,
            duration: 0.2,
          })
        }
        tooltip.style.display = "block"
        tooltip.innerHTML = `<strong>${hoveredSprite.userData.name}</strong><br>${hoveredSprite.userData.category}`
      }

      // Handle dragging
      if (isDragging) {
        const deltaX = clientX - previousX
        const deltaY = clientY - previousY
        grp.rotation.y += deltaX * 0.005
        grp.rotation.x += deltaY * 0.005
        previousX = clientX
        previousY = clientY
      }
    }

    const handleInteractionEnd = () => {
      isDragging = false
    }

    // Mouse events
    rndr.domElement.addEventListener("mousedown", (e) => {
      e.preventDefault()
      handleInteractionStart(e.clientX, e.clientY)
    })

    window.addEventListener("mousemove", (e) => {
      handleInteractionMove(e.clientX, e.clientY)
    })

    window.addEventListener("mouseup", handleInteractionEnd)

    // Touch events
    rndr.domElement.addEventListener(
      "touchstart",
      (e) => {
        e.preventDefault()
        const touch = e.touches[0]
        const currentTime = Date.now()

        // Handle double tap
        if (currentTime - lastTouchTime < 300) {
          autoRotate = !autoRotate
          if (selectedSprite) {
            selectedSprite = null
            if (this.gsap) {
              this.gsap.to(cam.position, {
                x: 0,
                y: 0,
                z: 50,
                duration: 0.5,
                ease: "power2.out",
              })
              sps.forEach((sp) => {
                this.gsap.to(sp.scale, {
                  x: sp.userData.originalScale,
                  y: sp.userData.originalScale,
                  duration: 0.3,
                })
              })
            }
          }
        }
        lastTouchTime = currentTime

        handleInteractionStart(touch.clientX, touch.clientY)
      },
      { passive: false },
    )

    rndr.domElement.addEventListener(
      "touchmove",
      (e) => {
        e.preventDefault()
        if (e.touches.length === 1) {
          const touch = e.touches[0]
          handleInteractionMove(touch.clientX, touch.clientY)
        }
      },
      { passive: false },
    )

    rndr.domElement.addEventListener(
      "touchend",
      (e) => {
        e.preventDefault()
        handleInteractionEnd()
      },
      { passive: false },
    )

    // Double click for desktop
    rndr.domElement.addEventListener("dblclick", (e) => {
      e.preventDefault()
      if (isWithinCanvas(e.clientX, e.clientY)) {
        autoRotate = !autoRotate
        if (selectedSprite) {
          selectedSprite = null
          if (this.gsap) {
            this.gsap.to(cam.position, {
              x: 0,
              y: 0,
              z: 50,
              duration: 0.5,
              ease: "power2.out",
            })
            sps.forEach((sp) => {
              this.gsap.to(sp.scale, {
                x: sp.userData.originalScale,
                y: sp.userData.originalScale,
                duration: 0.3,
              })
            })
          }
        }
      }
    })

    // Animation loop
    function animate() {
      requestAnimationFrame(animate)

      if (autoRotate && !selectedSprite) {
        grp.rotation.y += 0.005
      }

      grp.children.forEach((s) => s.lookAt(cam.position))
      rndr.render(scn, cam)
    }

    animate()
    updateCanvasRect()
  }

  renderExperience(experiences) {
    const container = document.getElementById("experience-container")
    container.innerHTML = (experiences || [])
      .map(
        (exp) => `
            <div class="exp-card" onclick="${exp.companyUrl ? `window.open('${exp.companyUrl}', '_blank')` : ""}"
                 style="cursor: ${exp.companyUrl ? "pointer" : "default"}">
                <div class="card-header-grid">
                    <img src="${exp.logo || "/placeholder.svg"}" alt="${exp.company || "Company"} logo" 
                         class="companylogo" style="${exp.logoStyle || ""}" loading="lazy">

                    <div class="card-header-text">
                        <h3>${exp.company || "Unknown Company"}</h3>
                        <p>${exp.role || "Role"} | ${exp.date || "N/A"}</p>
                    </div>
                    
                    <div style="height: 100%; display: flex; align-items: flex-start; justify-content: flex-end;">
                        ${exp.companyUrl ? `<img src="asset/logos/openlink.svg" alt="Open link" class="redirection-logo">` : ""}
                    </div>
                    
                    <div></div>
                    ${
                      exp.description
                        ? `
                    <ul>
                        ${exp.description.map((point) => `<li>${point}</li>`).join("")}
                    </ul>
                    `
                        : ""
                    }
                </div>
                ${
                  exp.skills
                    ? `
                <div class="skill-cards">
                    ${exp.skills.map((skill) => `<div class="skill-card">${skill}</div>`).join("")}
                </div>
                `
                    : ""
                }
            </div>
        `,
      )
      .join("")
  }

  renderExtracurriculars(extracurriculars) {
    const container = document.getElementById("extracurricular-container")
    container.innerHTML = (extracurriculars || [])
      .map(
        (item) => `
            <div class="exp-card" onclick="${item.url ? `window.open('${item.url}', '_blank')` : ""}"
                style="cursor: ${item.url ? "pointer" : "default"}">
                <div class="card-header-grid">
                    <div>
                        ${item.logo ? `<img src="${item.logo}" alt="${item.title || "Activity"} logo" class="companylogo" style="${item.logoStyle || ""}" loading="lazy">` : ""}
                    </div>

                    <div class="card-header-text">
                        <h3>${item.title || "Activity"}</h3>
                        <p>${item.date || "N/A"}</p>
                    </div>

                    ${
                      item.url
                        ? `
                    <div style="height: 100%; display: flex; align-items: flex-start; justify-content: right;">
                        <img src="asset/logos/openlink.svg" alt="Open link" class="redirection-logo">
                    </div>`
                        : "<div></div>"
                    }

                    <div></div>

                    ${
                      item.description
                        ? `
                    <ul>
                        <li>${item.description}</li>
                    </ul>`
                        : ""
                    }
                </div>
            </div>
        `,
      )
      .join("")
  }

  renderProjects(projects) {
    const container = document.getElementById("projects-container")
    const sortedProjects = (projects || [])
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.updatedAt) - new Date(a.updatedAt)
      })
      .slice(0, 6)

    container.innerHTML = sortedProjects
      .map(
        (project) => `
            <div class="pro-card" onclick="window.open('${project.githubUrl || "#"}', '_blank')"
                 aria-label="View ${project.name || "Project"} project">
                <div class="pro-card-header">
                    <div class="pro-card-title">
                        <h3>${project.name || "Unnamed Project"}</h3>
                    </div>
                    <p>${project.description || "No description available."}</p>
                </div>
                <div class="pro-card-body">
                    <div class="skill-cards">
                        ${(project.technologies || [])
                          .slice(0, 7)
                          .map((tech) => `<div class="skill-card">${tech}</div>`)
                          .join("")}
                    </div>
                    <div class="pro-card-links">
                        <a href="${project.githubUrl || "#"}" target="_blank" onclick="event.stopPropagation()">GitHub</a>
                        ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" onclick="event.stopPropagation()">Live Demo</a>` : ""}
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  renderCertificates(certificates) {
    const container = document.getElementById("certificates-container")
    container.innerHTML = (certificates || [])
      .map(
        (cert) => `
            <div class="certificate-card" style="background-image: url(${cert.image || "/placeholder.svg"})"
                 aria-label="${cert.title || "Certificate"} certificate">
                <div class="certificate-card-content">
                    <h2>${cert.title || "Certificate"}</h2>
                    <div class="certificate-card-content-bottom">
                        <p>${cert.date || "N/A"}<br>Credential ID: ${cert.credentialId || "N/A"}</p>
                        <a href="${cert.viewUrl || "#"}" target="_blank"
                           aria-label="View ${cert.title || "certificate"} details">View</a>
                    </div>
                </div>
            </div>
        `,
      )
      .join("")
  }

  renderNavigation(navItems) {
    const container = document.getElementById("dock-items")
    container.innerHTML = (navItems || [])
      .map(
        (item, index) => `
            <a href="#${item.section || ""}" class="item ${index === 0 ? "active" : ""}"
               data-vel-view="item" data-tooltip="${item.label || "Section"}"
               aria-label="Navigate to ${item.label || "Section"}">
                <img src="${item.icon || "/placeholder.svg"}" alt="${item.label || "Section"} icon">
            </a>
        `,
      )
      .join("")
  }

  initializeDock() {
    if (!this.Veloxi) {
      console.warn("Veloxi not loaded, skipping dock initialization")
      return
    }

    const { createApp, Events, Utils } = this.Veloxi

    const MacOsDockPlugin = (context) => {
      let items, root

      context.subscribeToEvents((eventBus) => {
        eventBus.subscribeToEvent(Events.PointerMoveEvent, onMouseMove)
      })

      function onMouseMove(event) {
        if (!root.intersects(event.x, event.y)) {
          items.forEach((item) => {
            item.size.reset()
          })
          return
        }
        items.forEach((item) => {
          const progress = Utils.pointToViewProgress({ x: event.x, y: event.y }, item, 120)
          const scale = Utils.remap(progress, 0, 1, 1, 2)
          item.size.set({ width: 40 * scale, height: 40 * scale })
        })
      }

      context.setup(() => {
        root = context.getView("root")
        items = context.getViews("item")
        items.forEach((item) => {
          item.size.setAnimator("dynamic")
          item.origin.set({ x: 0.5, y: 1 })
        })
      })
    }

    MacOsDockPlugin.pluginName = "MacOsDock"

    const app = createApp()
    app.addPlugin(MacOsDockPlugin)
    app.run()
  }

  initializeDockHighlighting() {
    const dockItems = document.querySelectorAll(".macos-dock .item")
    const sections = [
      document.getElementById("section1"),
      document.getElementById("section2"),
      document.getElementById("section6"),
      document.getElementById("section3"),
      document.getElementById("section5"),
      document.getElementById("section4"),
    ].filter(Boolean)

    let lastActiveIndex = -1
    let animationTimeout = null

    const setActiveDockItem = () => {
      let found = false
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom > 100) {
          if (lastActiveIndex !== i) {
            dockItems.forEach((item) => item.classList.remove("section-animate", "active"))
            if (dockItems[i]) {
              dockItems[i].classList.add("active", "section-animate")
              if (animationTimeout) clearTimeout(animationTimeout)
              animationTimeout = setTimeout(() => {
                if (dockItems[i]) {
                  dockItems[i].classList.remove("section-animate")
                }
              }, 300)
            }
            lastActiveIndex = i
          }
          found = true
          break
        }
      }
      if (!found) {
        dockItems.forEach((item) => item.classList.remove("active", "section-animate"))
        lastActiveIndex = -1
      }
    }

    window.addEventListener("scroll", setActiveDockItem, { passive: true })
    window.addEventListener("resize", setActiveDockItem)
    setActiveDockItem()
  }

  initializeFadeInAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    const observeNewDivs = () => {
      document
        .querySelectorAll(
          "div:not(.certificate-card):not(.certificate-card-content):not(.certificate-card-content-bottom):not(.loading)",
        )
        .forEach((div) => {
          if (!div.classList.contains("fade-in")) {
            observer.observe(div)
          }
        })
    }

    observeNewDivs()

    const mutationObserver = new MutationObserver(() => observeNewDivs())
    mutationObserver.observe(document.body, { childList: true, subtree: true })
  }

  initializeExperienceAnimations() {
    const cards = document.querySelectorAll(".exp-card")
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view")
        }
      })
    })

    cards.forEach((card) => {
      observer.observe(card)
    })
  }

  initializeScrollProgress() {
    window.addEventListener("scroll", () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = (scrollTop / scrollHeight) * 100
      this.scrollProgress.style.setProperty("--scroll-width", `${scrolled}%`)
    })

    this.scrollProgress.style.setProperty("--scroll-width", "0%")
  }

  initializePerformanceMonitoring() {
    if ("PerformanceObserver" in window) {
      try {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            console.log("LCP:", entry.startTime)
          }
        }).observe({ entryTypes: ["largest-contentful-paint"] })

        // First Input Delay
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            console.log("FID:", entry.processingStart - entry.startTime)
          }
        }).observe({ entryTypes: ["first-input"] })

        // Cumulative Layout Shift
        let clsValue = 0
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
              console.log("CLS:", clsValue)
            }
          }
        }).observe({ entryTypes: ["layout-shift"] })
      } catch (e) {
        console.warn("Performance monitoring setup failed:", e)
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      console.log("DOM Content Loaded:", performance.now())
    })

    window.addEventListener("load", () => {
      console.log("Window Load:", performance.now())
    })
  }

  initializeAdaptiveLoading() {
    if ("connection" in navigator) {
      const connection = navigator.connection
      const isSlow = connection.effectiveType === "slow-2g" || connection.effectiveType === "2g" || connection.saveData

      if (isSlow) {
        document.documentElement.style.setProperty("--transition-medium", "0.1s")
        document.documentElement.style.setProperty("--transition-slow", "0.1s")
        console.log("Slow connection detected - optimizing performance")
      }
    }
  }

  hideLoading() {
    this.loadingElement.classList.add("hidden")
    this.mainContent.classList.remove("hidden")
    this.dockContainer.classList.remove("hidden")
    this.isLoading = false
  }

  showError(message) {
    this.loadingElement.innerHTML = `<div class="error-message">Error: ${message}</div>`
  }
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return "N/A"
  try {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  } catch (error) {
    console.warn("Invalid date format:", dateString, error)
    return "N/A"
  }
}

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.portfolioApp = new PortfolioApp()
})

// Service Worker registration for improved performance
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Handle window resize for responsive design
window.addEventListener("resize", () => {
  setTimeout(() => {
    // Re-initialize dock highlighting after resize
    const app = window.portfolioApp
    if (app && typeof app.initializeDockHighlighting === "function") {
      app.initializeDockHighlighting()
    }
  }, 100)
})
