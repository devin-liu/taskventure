# TaskVenture Design System

## Logo Design

### Core Elements
The TaskVenture logo combines coding and gaming elements to create a unique identity:

- **Sword**: Represents quests and achievements
  - Blade: Amber (#F59E0B)
  - Handle & Guard: Dark Gray (#1F2937)
  
- **Code Brackets**: Symbolizes development
  - Stylized `<` and `>` brackets
  - Creates a path/road upward in negative space
  
- **Typography**: "Press Start 2P" font family
  - "Task" in regular weight
  - "Venture" in bold weight
  - Pixel-style for gaming aesthetic

### Animations
The logo includes interactive elements:

1. **Sparkle Effect**
   ```css
   animation: logoSparkle 3s infinite;
   ```
   - Subtle white flash at sword tip
   - Triggers every 3 seconds

2. **Bracket Pulse**
   - Amber glow effect on brackets
   - Subtle opacity changes

3. **Hover Animation**
   ```css
   hover:animate-logo-float
   ```
   - Gentle floating motion
   - 4px vertical movement

### Usage Guidelines

#### Spacing
- Maintain minimum padding of 16px around logo
- Default size: 32x32px for favicon, 40x40px for header
- Scale proportionally to maintain aspect ratio

#### Color Palette
```css
Primary:
- Amber: #F59E0B (text-amber-500)
- Dark Gray: #1F2937 (text-gray-800)

Accents:
- Light Amber: #FCD34D (text-amber-300)
- Light Gray: #F3F4F6 (text-gray-100)
```

#### Typography
```css
/* Main Font */
font-family: 'Press Start 2P', cursive;

/* Usage */
.font-pixel {
  font-family: 'Press Start 2P', cursive;
}
```

### Implementation

#### React Component
```tsx
<TaskVentureLogo
  width={32}
  height={32}
  className="hover:animate-logo-float"
  animated={true}
/>
```

#### Props
- `width`: Number (default: 40)
- `height`: Number (default: 40)
- `className`: String for additional styles
- `animated`: Boolean to toggle animations

### Dark Mode Support
The logo automatically adapts to dark mode:
- Light mode: Dark gray brackets on light background
- Dark mode: Light gray brackets on dark background

### File Formats
- SVG: Primary format for web use (`/public/logo.svg`)
- React Component: Animated version (`/src/components/TaskVentureLogo.tsx`)

## Brand Voice

### Typography Hierarchy
1. **Headings**
   ```css
   /* Main Headings */
   font-pixel text-3xl text-amber-900 dark:text-amber-400

   /* Subheadings */
   font-quest text-xl text-amber-800/80
   ```

2. **Body Text**
   ```css
   /* Regular Text */
   font-quest text-gray-900 dark:text-gray-100

   /* Secondary Text */
   text-amber-800/80 dark:text-amber-400/80
   ```

### Animation Guidelines
- Use smooth transitions (300ms duration)
- Prefer subtle movements over dramatic ones
- Ensure animations are accessible (respect reduced-motion preferences)

## Component Examples

### Header Implementation
```tsx
<header className="border-b border-amber-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
    <TaskVentureLogo width={32} height={32} className="hover:animate-logo-float" />
  </div>
</header>
```

## Accessibility
- Maintain WCAG 2.1 AA contrast ratios
- Provide alt text for logo: "TaskVenture Logo"
- Support reduced motion preferences
- Ensure text remains readable at all sizes

## Future Considerations
- Create vector assets for print materials
- Develop animated logo variations for loading states
- Design social media templates
- Create brand guidelines for marketing materials
