# TaskVenture Design System

## Core Concepts

TaskVenture transforms everyday coding tasks into an epic adventure, built on four fundamental pillars:

### 1. Quest-Driven Development
- **Tasks as Quests**: Each coding task becomes a heroic quest
- **Adventure Narrative**: Progress is framed as a journey through challenges
- **Milestone Achievements**: Completing quests unlocks achievements and rewards

### 2. Developer Progression System
- **Character Classes**:
  - 🌱 Intern: Beginning the coding journey
  - 👨‍💻 Junior Dev: Mastering the basics
  - 🚀 Senior Dev: Crafting elegant solutions
  - 👑 Tech Lead: Guiding others
  - 🦄 Unicorn Status: Achieving legendary skills

### 3. Gamification Elements
- **XP System**: Gain experience points for completed tasks
- **Difficulty Levels**: 
  - Tasks scale from Trivial to Master challenges
  - Higher difficulty yields greater rewards
- **Quest Types**:
  - Feature Quests: Building new capabilities
  - Bug Hunts: Solving mysteries
  - Refactor Missions: Improving existing code
  - DevOps Adventures: Mastering infrastructure
  - Growth Hacks: Optimizing performance

### 4. Modern Development Experience
- **Clean Interface**: Minimalist design with playful elements
- **Dark Mode Support**: Comfortable coding in any lighting
- **Responsive Design**: Seamless experience across devices
- **Accessibility**: Inclusive design for all developers

These core concepts are reflected throughout our design system, from the logo to the smallest UI elements. Each visual choice reinforces the balance between professional functionality and engaging gameplay.

## Logo Design

### Core Elements
The TaskVenture logo combines coding and gaming elements to create a unique identity that reflects our core concepts:

#### Quest-Driven Development
- **Sword Element**: Represents the heroic journey of development
  - Upward-pointing blade suggests progress and achievement
  - Amber color symbolizes rewards and valuable experience
  - Handle represents the tools developers wield

#### Developer Progression
- **Negative Space Path**: Forms an upward path between brackets
  - Symbolizes the journey from Intern to Unicorn Status
  - Creates visual momentum toward growth
  - Suggests levels of advancement

#### Gamification
- **Interactive Animations**:
  - Sparkle effect represents achievement moments
  - Floating animation adds playful engagement
  - Pulse effect shows active progression

#### Modern Development
- **Code Brackets**: Merges gaming with development
  - Clean, minimal design for professional appeal
  - Dark mode support for developer comfort
  - Scalable SVG format for technical excellence

The logo serves as a microcosm of TaskVenture's identity, where each element has been carefully chosen to represent both the practical and playful aspects of modern development.

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
