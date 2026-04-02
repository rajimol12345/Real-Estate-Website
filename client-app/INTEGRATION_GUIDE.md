# Hero Slider Integration Guide

## Quick Start

This guide explains how to integrate the Estate Pro hero slider component into your React application.

---

## Option 1: Using react-slick (FlexSlider-based)

### Installation

```bash
npm install react-slick slick-carousel react-hook-form
```

### Basic Usage

```jsx
import HeroSlider from './components/HeroSlider/HeroSlider';
import './components/HeroSlider/HeroSlider.css';

function App() {
  return (
    <div className="app">
      <HeroSlider />
      {/* Rest of your app */}
    </div>
  );
}

export default App;
```

### With Custom Slides

```jsx
import HeroSlider from './components/HeroSlider/HeroSlider';
import { SliderSlide } from './components/HeroSlider/sliderTypes';

function App() {
  const slides: SliderSlide[] = [
    {
      id: 1,
      image: '/images/property-1.jpg',
      price: '$250,000',
      title: 'Beautiful Home',
      link: '/listings/1'
    },
    // More slides...
  ];

  return <HeroSlider />;
}
```

---

## Option 2: Using Swiper (Modern Alternative)

### Installation

```bash
npm install swiper react-hook-form
```

### Basic Usage

```jsx
import HeroSliderSwiper from './components/HeroSlider/HeroSliderSwiper';
import './components/HeroSlider/hero-slider.css';

function App() {
  return (
    <div className="app">
      <HeroSliderSwiper />
      {/* Rest of your app */}
    </div>
  );
}

export default App;
```

### Why Choose Swiper?

1. **Lighter**: ~30KB vs react-slick's ~50KB
2. **Better Performance**: Hardware-accelerated transitions
3. **Modern**: Active development and maintenance
4. **Better Touch**: Superior mobile touch handling
5. **Lazy Loading**: Native support for lazy-loading images

---

## Configuration

### Slider Configuration Options

```jsx
const config = {
  autoplay: true,           // Auto-play slides
  autoplaySpeed: 7000,      // Duration between slides (ms)
  speed: 600,               // Transition speed (ms)
  pauseOnHover: true,       // Pause on mouse hover
  loop: true,               // Loop back to first slide
  touch: true,              // Enable touch gestures
  keyboard: false,          // Enable keyboard navigation
  effect: 'slide',          // 'slide' or 'fade'
};
```

### Color Customization

The component uses CSS custom properties for easy color customization:

```css
:root {
  --primary-blue: #1b9bff;
  --accent-green: #8bb812;
  --dark-gray: #45515a;
  --text-white: #ffffff;
}
```

Or override in your CSS:

```css
#search.homepage_search {
  --primary-blue: #your-color;
}
```

---

## API Integration

### Fetching Slides Dynamically

```jsx
import { useEffect, useState } from 'react';
import HeroSlider from './components/HeroSlider/HeroSlider';

function App() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/properties?featured=true');
        const data = await response.json();
        
        // Transform API response to slider format
        const formattedSlides = data.map(property => ({
          id: property.id,
          image: property.featuredImage,
          price: `$${property.price.toLocaleString()}`,
          title: property.address,
          link: `/listings/${property.id}`,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          squareFeet: property.squareFeet
        }));
        
        setSlides(formattedSlides);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  if (loading) return <div>Loading slider...</div>;
  if (error) return <div>Error: {error}</div>;

  return <HeroSlider slides={slides} />;
}
```

### Handling Search Form Submission

```jsx
const handleSearch = async (filters) => {
  try {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v)
      )
    );
    
    const response = await fetch(`/api/properties/search?${params}`);
    const results = await response.json();
    
    // Navigate to results page or update listings
    navigate(`/listings?${params.toString()}`, { state: { results } });
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

---

## CSS Integration

### Import the CSS file

**Option 1: In your main App.jsx**
```jsx
import './assets/css/hero-slider.css';
```

**Option 2: In your CSS/SCSS file**
```css
@import './assets/css/hero-slider.css';
```

**Option 3: Modify/extend the CSS**
Create your own CSS file and override styles:

```css
/* Override primary color */
#search.homepage_search .form_elements {
  background: #your-color;
}

/* Make form title responsive */
@media (max-width: 768px) {
  .searchForm .formTitle {
    font-size: 20px;
    padding: 20px 25px;
  }
}
```

---

## Responsive Behavior

The component includes responsive styles for:

- **Desktop** (≥1200px): Full layout with navigation arrows
- **Tablet** (768px - 1199px): Adjusted spacing and font sizes
- **Mobile** (<768px): Stacked form elements, smaller navigation

### Testing Responsive Design

```javascript
// In your test file
describe('HeroSlider', () => {
  it('should display form elements stacked on mobile', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    
    render(<HeroSlider />);
    // Assert mobile layout
  });
});
```

---

## Accessibility

The component includes several accessibility features:

### ARIA Labels
```html
<button aria-label="Previous slide" type="button">
  <i className="fa fa-chevron-left"></i>
</button>
```

### Semantic HTML
- Forms use proper `<label>` and `<select>` elements
- Navigation buttons have descriptive aria-labels
- Images have alt text

### Keyboard Navigation
- Tab through form elements
- Enter to submit form
- Arrow keys for slide navigation (can be enabled)

### Testing Accessibility

```javascript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<HeroSlider />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Image Optimization

### Lazy Loading

Images are lazy-loaded by default using the `loading="lazy"` attribute:

```jsx
<img 
  src={slide.image} 
  alt={slide.title}
  loading="lazy"
  onError={(e) => {
    e.target.src = '/images/placeholder.jpg';
  }}
/>
```

### Use Next Image Component (if using Next.js)

```jsx
import Image from 'next/image';

export function SlideImage({ src, alt, title }) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      width={1200}
      height={600}
      priority={false}
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg,..."
    />
  );
}
```

### Image CDN Integration

```javascript
// Optimize image URLs with CDN
function getOptimizedImageUrl(imageUrl, width = 1200, height = 600) {
  const cdnUrl = `https://your-cdn.com/image?url=${encodeURIComponent(imageUrl)}&w=${width}&h=${height}&q=85`;
  return cdnUrl;
}

const optimizedSlides = slides.map(slide => ({
  ...slide,
  image: getOptimizedImageUrl(slide.image)
}));
```

---

## Performance Optimization

### 1. Code Splitting

```jsx
import { lazy, Suspense } from 'react';

const HeroSlider = lazy(() => import('./components/HeroSlider/HeroSlider'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroSlider />
    </Suspense>
  );
}
```

### 2. Memoization

```jsx
import { memo } from 'react';

const SlideCard = memo(({ slide }) => (
  <div className="slider-slide">
    <img src={slide.image} alt={slide.title} />
    <span>{slide.price}</span>
  </div>
));
```

### 3. Bundle Size Optimization

Choose slick vs Swiper based on your needs:

```bash
# Bundle size comparison
# react-slick: ~50KB
# swiper: ~30KB
# swiper (with tree-shaking): ~15-20KB
```

---

## Common Issues & Solutions

### Issue 1: Slider Not Displaying

**Problem**: Slider appears empty or images don't show
```jsx
// Solution 1: Check image paths
const slides = [
  {
    id: 1,
    image: '/images/slider/slide-1.jpg', // Must be public folder
    price: '$250,000',
    link: '/listings/1'
  }
];

// Solution 2: Import CSS correctly
import '../../assets/css/hero-slider.css';

// Solution 3: Check z-index conflicts
#mainSlider { z-index: 1; }
#search { z-index: 2; }
```

### Issue 2: Form Not Submitting

**Problem**: Form submission doesn't work
```jsx
// Solution: Ensure onSubmit handler is properly connected
const { control, handleSubmit } = useForm();

const onSubmit = (data) => {
  console.log('Form data:', data);
  // Handle submission
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Form fields */}
  </form>
);
```

### Issue 3: Mobile Responsiveness Issues

**Problem**: Layout breaks on mobile
```css
/* Solution: Debug responsive behavior */
@media (max-width: 768px) {
  .searchForm .form_elements {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  
  .form_element {
    width: 100%;
    margin-bottom: 10px;
  }
}
```

### Issue 4: Touch Not Working

**Problem**: Touch navigation doesn't work on mobile
```jsx
// Solution: Ensure touch is enabled in config
const config = {
  touch: true,           // Enable touch
  swipe: true,           // Enable swipe
  touchAngle: 45,        // Angle tolerance
  touchStartX: 0,        // Initial touch position
};
```

---

## Testing

### Unit Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import HeroSlider from './HeroSlider';

describe('HeroSlider', () => {
  const mockSlides = [
    { id: 1, image: '/img1.jpg', price: '$100', link: '/1' },
    { id: 2, image: '/img2.jpg', price: '$200', link: '/2' }
  ];

  it('renders slider with slides', () => {
    render(<HeroSlider slides={mockSlides} />);
    expect(screen.getByRole('region')).toBeInTheDocument();
  });

  it('navigates to next slide', () => {
    render(<HeroSlider slides={mockSlides} />);
    const nextButton = screen.getByLabelText('Next slide');
    fireEvent.click(nextButton);
    // Assert slide changed
  });

  it('submits search form', () => {
    const mockOnSearch = jest.fn();
    render(<HeroSlider slides={mockSlides} onSearch={mockOnSearch} />);
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    expect(mockOnSearch).toHaveBeenCalled();
  });
});
```

### E2E Tests (Cypress)

```javascript
describe('Hero Slider E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('autoplay slides on home page', () => {
    cy.get('#mainSlider .slides li').first().should('have.class', 'flex-active-slide');
    cy.wait(7000);
    cy.get('#mainSlider .slides li').eq(1).should('have.class', 'flex-active-slide');
  });

  it('navigate through slides', () => {
    cy.get('button[aria-label="Next slide"]').click();
    cy.get('#mainSlider .slides li').eq(1).should('have.class', 'flex-active-slide');
    
    cy.get('button[aria-label="Previous slide"]').click();
    cy.get('#mainSlider .slides li').first().should('have.class', 'flex-active-slide');
  });

  it('submit search form with filters', () => {
    cy.get('select[name="propertyType"]').select('house');
    cy.get('select[name="location"]').select('newyork');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/listing-grid');
  });
});
```

---

## Analytics & Tracking

### Google Analytics Integration

```jsx
import { useEffect } from 'react';

function HeroSlider({ slides }) {
  useEffect(() => {
    // Track slide changes
    window.gtag?.('event', 'slider_view', {
      'slide_count': slides.length,
      'component': 'hero_slider'
    });
  }, [slides]);

  const handleSearch = (filters) => {
    // Track search
    window.gtag?.('event', 'property_search', {
      'search_filters': Object.keys(filters).join(','),
      'filters_count': Object.values(filters).filter(v => v).length
    });
  };

  const handleSlideChange = () => {
    window.gtag?.('event', 'slide_change', {
      'component': 'hero_slider'
    });
  };

  return (
    // Component JSX
  );
}
```

---

## Browser Support

| Browser | Support | Version |
|---------|---------|---------|
| Chrome | ✅ | Latest |
| Firefox | ✅ | Latest |
| Safari | ✅ | 11+ |
| Edge | ✅ | Latest |
| IE 11 | ⚠️ | Limited* |

*Some CSS3 features may need pollyfills

---

## Dependencies Summary

### Core Dependencies
```json
{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "react-hook-form": "^7.0.0"
}
```

### Slider Library (Choose One)
```json
{
  "react-slick": "^0.29.0",
  "slick-carousel": "^1.8.1"
}
```

Or

```json
{
  "swiper": "^10.0.0"
}
```

### Optional
```json
{
  "react-router-dom": "^6.0.0",
  "axios": "^1.0.0",
  "classnames": "^2.3.0"
}
```

---

## Additional Resources

- [Original Template](https://demoxml.com/html/estatepro/index.html)
- [React Slick Documentation](https://react-slick.neostack.com/)
- [Swiper Documentation](https://swiperjs.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/)

---

## Support & Troubleshooting

For issues or questions:

1. Check the included CSS file for style conflicts
2. Verify image paths are correct
3. Test in different browsers
4. Check console for JavaScript errors
5. Review the TypeScript types for proper usage

---

## License

This component is based on the Estate Pro template from demoxml.com. Ensure you have proper licensing for the template images and fonts.

