---
title: Tailwind CSS Themes Project
date: '2022-09-07'
tags: ['themes', 'css-vars']
draft: false
summary: The Tailwind CSS Themes Project for easy an easy theme kickstarter.
images: []
layout: PostLayout
canonicalUrl:
authors: ['default']
---

# Open Source Project

This project is a theme designer and theme kickstarter. The project will include all of the daisyUI themes 'as is' as well as a repository of the themes I have created. The bonus will be a full copy/paste script section for getting all of the necessary theme information for customization, but in the format needed for daisy config, this alone will extremely helpful in providing the required information in the required format as well as the css-vars and the tailwind settings, which are frequently skipped. This will help tremendously in my own workflow and the hope is this is a project that will gain some interest and exposure.

### Standard Tailwind CSS file at start:

```css
// usual start-up
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Enhance version created from TailwindCSS Themes:

```css
// tailwind themes
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
    --primary: themes.colors.primary
    --secondary: themes.colors.secondary
    --accent: themes.colors.accent
    --base-100: themes.colors.base100
}
```

The tailwind config setup as well... additionally, I frequently use a light/dark only setup if ANY on a project, rarely would a brand offer multiple themes, but the brand can have a light/dark, as far as the included daisyUI themes, they do not come with light/dark options, I usually create a theme then make the inverse... this is a little time consuming and messy, hence the idea to start this project.

## Project Location

Here's the location and latest release will always be available with all included themes.. it's a work in progress for now, but a clear vision has been established.

[Live Site](https://tailwindcss-themes.vercel.app/)
