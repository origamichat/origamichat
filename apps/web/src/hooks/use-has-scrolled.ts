"use client";

import { useEffect, useState } from "react";

export function useHasScrolled(value: number): boolean {
	const [hasScrolled, setHasScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setHasScrolled(scrollTop > value);
		};

		// Check initial scroll position
		handleScroll();

		// Add scroll event listener
		window.addEventListener("scroll", handleScroll, { passive: true });

		// Cleanup event listener on unmount
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, [value]);

	return hasScrolled;
}
