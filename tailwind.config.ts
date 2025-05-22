
/**
 * @fileOverview Tailwind CSS configuration file.
 * Defines the theme, customizes styles, and enables plugins for Tailwind CSS.
 * It includes dark mode setup, content paths for purging unused styles,
 * and extensions to the default Tailwind theme (colors, borderRadius, keyframes, animations).
 */
import type { Config } from "tailwindcss";

const config: Config = {
    /**
     * Enables dark mode based on a class applied to the HTML element.
     * Typically used with `next-themes` where `ThemeProvider` adds `class="dark"`.
     */
    darkMode: ["class"],
    /**
     * Paths to all template files in your project.
     * Tailwind CSS uses these paths to scan for class names and remove unused styles
     * in production builds, optimizing the final CSS bundle size.
     */
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    /**
     * Theme customization section.
     * Allows extending or overriding Tailwind's default theme.
     */
  	extend: {
      /**
       * Custom color palette defined using CSS custom properties (variables).
       * These variables are typically defined in `globals.css` for light and dark themes.
       */
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
        // Custom color palette for charts.
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        // Custom color palette for sidebar elements.
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
      /**
       * Custom border radius values.
       * These are mapped to the `--radius` CSS custom property defined in `globals.css`.
       */
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      /**
       * Custom keyframes for animations.
       * Used here for accordion open/close animations.
       */
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)' // Uses Radix UI's CSS variable
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
      /**
       * Custom animation utilities.
       * Maps keyframes to utility classes (e.g., `animate-accordion-down`).
       */
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  /**
   * Tailwind CSS plugins.
   * `tailwindcss-animate` adds utilities for animations based on keyframes.
   */
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
