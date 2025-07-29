'use client';

import { useState, useEffect, useCallback } from 'react';

interface Props {
  slug: string;
  initialViews?: number;
}

export default function ViewCounter({ slug, initialViews }: Props) {
  const [views, setViews] = useState(initialViews ?? 0);
  const [hasFetchedFresh, setHasFetchedFresh] = useState(false);

  const fetchViews = useCallback(async () => {
    try {
      const response = await fetch(`/api/views/${slug}`);
      if (response.ok) {
        const data = await response.json();
        // Only update if the value has actually changed to prevent unnecessary re-renders
        setViews((prevViews) => {
          if (data.views !== prevViews) {
            return data.views;
          }
          return prevViews;
        });
        setHasFetchedFresh(true);
      }
    } catch (error) {
      console.error('Failed to fetch views:', error);
    }
  }, [slug]);

  // Fetch fresh views only once after initial render
  useEffect(() => {
    if (!hasFetchedFresh) {
      // Small delay to prevent blocking initial render
      const timer = setTimeout(fetchViews, 50);
      return () => clearTimeout(timer);
    }
  }, [fetchViews, hasFetchedFresh]);

  // Listen for focus events and view updates to refresh data
  useEffect(() => {
    const handleFocus = () => {
      if (hasFetchedFresh) {
        fetchViews();
      }
    };

    const handleViewUpdate = (event: CustomEvent) => {
      if (event.detail?.slug === slug) {
        fetchViews();
      }
    };

    window.addEventListener('focus', handleViewUpdate as EventListener);
    window.addEventListener('viewUpdated', handleViewUpdate as EventListener);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener(
        'viewUpdated',
        handleViewUpdate as EventListener
      );
    };
  }, [slug, fetchViews, hasFetchedFresh]);

  return (
    <span className="animation-fill-mode-both animate-slideFadeUp">
      {views} views
    </span>
  );
}
