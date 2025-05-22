
"use client"
/**
 * @fileOverview ModeToggle component.
 * Provides a dropdown menu to switch between light, dark, and system themes
 * using the `next-themes` library.
 */

import * as React from "react"
import { Moon, Sun } from "lucide-react" // Icons for theme states
import { useTheme } from 'next-themes' // Hook from next-themes library

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/**
 * ModeToggle functional component.
 * Renders a button that, when clicked, opens a dropdown menu allowing the user
 * to select their preferred color theme (light, dark, or system default).
 * @returns {JSX.Element} The rendered theme toggle button and dropdown.
 */
export function ModeToggle() {
  const { setTheme } = useTheme(); // `setTheme` function from useTheme to change the current theme.

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {/* Sun icon for light mode, Moon icon for dark mode. Rotates and scales for transition. */}
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span> {/* Screen reader text */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Dropdown items to select a theme */}
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
