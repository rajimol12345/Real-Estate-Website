# Estate Pro Hero Slider - Complete Implementation Reference

## Overview
The Estate Pro template uses a **FlexSlider** based hero/carousel section combined with an integrated property search form. This document provides the exact HTML structure, CSS styling, and JavaScript requirements.

---

## 1. HTML MARKUP - Hero Slider Section

```html
<!-- Main Slider Container -->
<div id="mainSlider" class="flexslider">
  <ul class="slides">
    <!-- Slide 1 -->
    <li>
      <img src="images/slider/slide-1.jpg" alt="Property Slide 1">
      <div class="captions">
        <div class="container">
          <div class="row">
            <span class="sale-price">$250,000</span>
            <a href="#"><i class="fa fa-link"></i> View Details</a>
          </div>
        </div>
      </div>
    </li>

    <!-- Slide 2 -->
    <li>
      <img src="images/slider/slide-2.jpg" alt="Property Slide 2">
      <div class="captions">
        <div class="container">
          <div class="row">
            <span class="sale-price">$350,000</span>
            <a href="#"><i class="fa fa-link"></i> View Details</a>
          </div>
        </div>
      </div>
    </li>

    <!-- Slide 3 -->
    <li>
      <img src="images/slider/slide-3.jpg" alt="Property Slide 3">
      <div class="captions">
        <div class="container">
          <div class="row">
            <span class="sale-price">$450,000</span>
            <a href="#"><i class="fa fa-link"></i> View Details</a>
          </div>
        </div>
      </div>
    </li>
  </ul>

  <!-- FlexSlider Navigation Controls -->
  <ul class="flex-direction-nav">
    <li>
      <a class="flex-prev" href="#"><i class="fa fa-chevron-left"></i></a>
    </li>
    <li class="flex-nav-prev">
      <a class="flex-next" href="#"><i class="fa fa-chevron-right"></i></a>
    </li>
  </ul>
</div>

<!-- Property Search Form - Integrated with Slider -->
<section id="search" class="homepage_search">
  <div class="searchForm">
    <div class="formTitle">
      find your<span>House</span>
    </div>
    <div class="form_elements">
      <div class="form_element">
        <label>Property Type</label>
        <select class="bootstrap-select propertyType" data-language="en">
          <option value="">Any</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="townhouse">Townhouse</option>
          <option value="condo">Condo</option>
        </select>
      </div>

      <div class="form_element">
        <label>Location</label>
        <select class="bootstrap-select propertyLocation">
          <option value="">Any</option>
          <option value="newyork">New York</option>
          <option value="losangeles">Los Angeles</option>
          <option value="chicago">Chicago</option>
        </select>
      </div>

      <div class="form_element">
        <label>Beds</label>
        <select class="bootstrap-select beds">
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>

      <div class="form_element">
        <label>Baths</label>
        <select class="bootstrap-select baths">
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3+</option>
        </select>
      </div>

      <div class="form_element">
        <label>Sq ft</label>
        <select class="bootstrap-select sqft">
          <option value="">Any</option>
          <option value="1000">1000+</option>
          <option value="2000">2000+</option>
          <option value="3000">3000+</option>
        </select>
      </div>

      <div class="form_element">
        <label>Min Price</label>
        <select class="bootstrap-select minPrice">
          <option value="">Any</option>
          <option value="100000">$100,000</option>
          <option value="250000">$250,000</option>
          <option value="500000">$500,000</option>
        </select>
      </div>

      <div class="form_element">
        <label>Max Price</label>
        <select class="bootstrap-select maxPrice">
          <option value="">Any</option>
          <option value="300000">$300,000</option>
          <option value="500000">$500,000</option>
          <option value="1000000">$1,000,000</option>
        </select>
      </div>

      <div class="form_element">
        <button type="submit" class="btn btn-search">Search</button>
      </div>
    </div>
  </div>
</section>
```

---

## 2. CSS CLASSES & COMPLETE STYLING

```css
/* ===== SLIDER CONTAINER ===== */
#mainSlider {
  border: none;
  border-radius: 0;
  margin-bottom: 0;
  position: relative;
}

#mainSlider .slides {
  list-style: none;
  margin: 0;
  padding: 0;
}

#mainSlider .slides li {
  position: relative;
  width: 100%;
  display: none;
}

#mainSlider .slides li.flex-active-slide {
  display: block;
}

#mainSlider .slides li img {
  width: 100%;
  height: auto;
  display: block;
}

/* ===== SLIDER CAPTIONS ===== */
#mainSlider .slides li .captions {
  position: absolute;
  width: 100%;
  bottom: 110px;
  z-index: 10;
}

#mainSlider .slides li .captions .container {
  width: 100%;
  margin: 0 auto;
}

#mainSlider .slides li .captions .container .row {
  line-height: 60px;
  background: rgba(69, 81, 90, 0.8);
  color: #fff;
  padding-left: 20px;
  padding-right: 120px;
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  font-size: 18px;
  margin: 0;
  position: relative;
}

#mainSlider .slides li .captions .container .row span {
  float: right;
  padding: 0 20px;
  background: #8bb812;
  display: inline-block;
  line-height: 60px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}

#mainSlider .slides li .captions .container .row a {
  display: inline-block;
  float: right;
  padding: 0 20px;
  background: #727272;
  font-size: 16px;
  font-weight: 300;
  color: #fff;
  line-height: 60px;
  text-decoration: none;
  margin-right: 10px;
}

#mainSlider .slides li .captions .container .row a i {
  font-size: 20px;
  margin-right: 7px;
}

/* ===== NAVIGATION CONTROLS ===== */
#mainSlider .flex-direction-nav {
  position: relative;
  margin: 0 auto;
  text-align: center;
  top: -170px;
  list-style: none;
  padding: 0;
  z-index: 20;
}

#mainSlider .flex-direction-nav li {
  position: absolute;
  right: 15px;
  display: inline-block;
}

#mainSlider .flex-direction-nav li.flex-nav-prev {
  right: 75px;
}

#mainSlider .flex-direction-nav li a {
  line-height: 59px;
  height: 60px;
  position: relative;
  left: 0;
  display: block;
  opacity: 1;
  top: 0;
  width: 60px;
  margin: 0;
  border-bottom: 1px solid #198feb;
  border-left: 1px solid #198feb;
  text-align: center;
  background: #1b9bff;
  color: #fff;
  padding: 0;
  transition: all 300ms ease-in-out 0s;
  cursor: pointer;
}

#mainSlider .flex-direction-nav li a:hover {
  opacity: 0.9;
  background: #0d7dd0;
}

#mainSlider .flex-direction-nav li a:before {
  display: none;
}

#mainSlider .flex-direction-nav li a i {
  background: none;
  font-size: 24px;
}

/* ===== SEARCH FORM ===== */
#search.homepage_search {
  margin-top: -110px;
  margin-bottom: 15px;
  z-index: 2;
  position: relative;
}

.searchForm {
  overflow: visible;
  max-width: 1200px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.searchForm .formTitle {
  padding: 28px 35px;
  background: #fff;
  font-family: 'Philosopher', sans-serif;
  font-size: 27px;
  font-weight: bold;
  color: #1b9bff;
  line-height: 1;
  margin: 0;
  border-bottom: 3px solid #1b9bff;
}

.searchForm .formTitle span {
  font-family: 'Philosopher', sans-serif;
  font-size: 18px;
  font-weight: normal;
  display: block;
}

.searchForm .form_elements {
  background: #1b9bff;
  padding: 20px;
  overflow: visible;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
}

.searchForm .form_element {
  padding: 3px 0;
  flex: 1;
  min-width: 120px;
}

.searchForm .form_element + .form_element {
  padding-left: 10px;
}

.searchForm .form_element label {
  display: block;
  font-weight: normal;
  font-family: 'Roboto', sans-serif;
  color: #fff;
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 7px;
  line-height: 1;
}

.searchForm .form_element .bootstrap-select {
  width: 100%;
}

.searchForm .form_element .bootstrap-select.propertyType,
.searchForm .form_element .bootstrap-select.propertyLocation {
  width: 150px;
}

.searchForm .form_element .bootstrap-select.beds,
.searchForm .form_element .bootstrap-select.baths {
  width: 85px;
}

.searchForm .form_element .bootstrap-select button {
  background: none #fff;
  border-radius: 5px;
  border: none;
  line-height: 37px;
  padding: 0 10px;
  color: #b2b2b2;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  width: 100%;
  text-align: left;
}

.searchForm .form_element .bootstrap-select .dropdown-menu {
  border-radius: 0;
  padding: 0;
  margin-top: 0;
  border: 1px solid #1b9bff;
}

.searchForm .form_element .bootstrap-select .dropdown-menu .inner li a {
  color: #859ab3;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  padding: 10px 15px;
  line-height: 20px;
}

.searchForm .form_element .bootstrap-select .dropdown-menu .inner li a:hover {
  background: none #1b9bff;
  color: #fff;
}

.searchForm .form_element .bootstrap-select .dropdown-menu .inner li.selected a {
  background: none #1b9bff;
  color: #fff;
}

.searchForm .form_element button[type="submit"] {
  background: rgba(0, 0, 0, 0.2);
  line-height: 37px;
  padding: 0 25px;
  text-transform: capitalize;
  margin-top: 26px;
  text-shadow: none;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 15px;
  cursor: pointer;
  transition: all 300ms ease-in-out 0s;
}

.searchForm .form_element button[type="submit"]:hover {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
}
```

---

## 3. COLOR PALETTE (Hex Codes)

| Element | Color | Hex Code |
|---------|-------|----------|
| Primary Blue (Buttons, Links) | ![#1b9bff](https://via.placeholder.com/20/1b9bff/1b9bff) | `#1b9bff` |
| Search Panel Background | ![#1b9bff](https://via.placeholder.com/20/1b9bff/1b9bff) | `#1b9bff` |
| Accent Green (Price Tags) | ![#8bb812](https://via.placeholder.com/20/8bb812/8bb812) | `#8bb812` |
| Dark Gray (Body Text) | ![#45515a](https://via.placeholder.com/20/45515a/45515a) | `#45515a` |
| Caption Background | rgba(69, 81, 90, 0.8) | `rgba(69, 81, 90, 0.8)` |
| White (Form Title) | ![#ffffff](https://via.placeholder.com/20/ffffff/ffffff) | `#fff` |
| Light Gray (Form Inputs) | ![#b2b2b2](https://via.placeholder.com/20/b2b2b2/b2b2b2) | `#b2b2b2` |
| Secondary Blue (Nav Borders) | ![#198feb](https://via.placeholder.com/20/198feb/198feb) | `#198feb` |
| Button Gray | ![#727272](https://via.placeholder.com/20/727272/727272) | `#727272` |
| Text/Icon Gray | ![#859ab3](https://via.placeholder.com/20/859ab3/859ab3) | `#859ab3` |

---

## 4. TYPOGRAPHY

### Font Families
- **Main Font:** `'Roboto', sans-serif` (weights: 300, 400)
- **Heading Font:** `'Philosopher', sans-serif` (weights: normal, bold)

### Font Sizes & Styling

| Element | Font Size | Font Weight | Line Height | Color |
|---------|-----------|-------------|-------------|-------|
| Form Title Main | 27px | bold | 1 | #1b9bff |
| Form Title Span | 18px | normal | auto | #1b9bff |
| Form Labels | 14px | 300 | auto | #fff |
| Form Dropdowns | 14px | 400 | 37px | #b2b2b2 |
| Caption Text | 18px | bold | 60px | #fff |
| Caption Links | 16px | 300 | 60px | #fff |

---

## 5. JAVASCRIPT - FlexSlider Implementation

```javascript
// Initialize FlexSlider
jQuery(document).ready(function($) {
  $('#mainSlider').flexslider({
    animation: 'slide',          // 'fade' or 'slide'
    direction: 'ltr',            // 'ltr' or 'rtl'
    slideshow: true,             // Enable automatic slideshow
    slideshowSpeed: 7000,        // Duration of each slide in ms (7 seconds)
    animationSpeed: 600,         // Duration of slide animation in ms
    pauseOnHover: true,          // Pause slideshow on hover
    controlNav: false,           // Hide dots below slider
    directionNav: true,          // Show prev/next arrows
    keyboard: false,             // Disable keyboard navigation
    multipleKeyboard: false,
    mousewheel: false,           // Disable mousewheel navigation
    touch: true,                 // Enable touch gestures for mobile
    smoothHeight: true,          // Automatically adjust height
    useCSS: true,                // Use CSS transforms where possible
    prevText: "",               // Custom prev button text (you set it with icon)
    nextText: "",               // Custom next button text (you set it with icon)
    start: function(slider){
      // Called after slider loads
      console.log('Slider loaded');
    },
    before: function(slider){
      // Called before slide change
    },
    after: function(slider){
      // Called after slide change
    },
    end: function(slider){
      // Called at end of animation
    },
    added: function(slider){
      // Called after new slide is added
    },
    removed: function(slider){
      // Called after slide is removed
    }
  });
});
```

### Required jQuery FlexSlider Files

```html
<!-- FlexSlider CSS -->
<link rel="stylesheet" href="css/flexslider.css">

<!-- jQuery FlexSlider JS -->
<script src="js/jquery.flexslider-min.js"></script>

<!-- jQuery & jQuery Easing (Dependencies) -->
<script src="js/jquery.min.js"></script>
<script src="js/jquery.easing.js"></script>
```

---

## 6. IMAGE PATHS & RESOURCES

### Slider Image Locations
```
Base Path: /demoxml.com/html/estatepro/

Slider Images:
- images/slider/slide-1.jpg
- images/slider/slide-2.jpg
- images/slider/slide-3.jpg
- images/slider/slide-4.jpg
- images/slider/slide-5.jpg

Agent Images:
- images/agents/agent-1.jpg
- images/agents/agent-2.jpg

Miscellaneous:
- images/page-cover.jpg
- images/map-overlay.png
- images/checked.png
- images/check-blank.png
```

---

## 7. LAYOUT & DIMENSIONS

### Slider Container
- **Width:** 100% (full viewport)
- **Height:** Auto (responsive)
- **Min Height:** ~500px (recommended)
- **Max Height:** ~600px (recommended)

### Navigation Buttons
- **Width:** 60px
- **Height:** 60px
- **Position:** Absolute, bottom-right of slider
- **Right Offset:** 15px (next), 75px (prev)
- **Top Offset:** -170px (relative to bottom)

### Search Form
- **Max Width:** 1200px
- **Margin Top:** -110px (overlaps slider)
- **Margin Bottom:** 15px
- **Z-Index:** 2 (above slider)

### Form Title
- **Padding:** 28px 35px
- **Min Height:** 60px

### Form Elements Container
- **Padding:** 20px
- **Display:** Flex (responsive)
- **Gap:** 10px between elements
- **Min Element Width:** 120px

### Dropdown Selects
- **Height:** 37px
- **Border Radius:** 5px
- **Padding:** 0 10px
- **Property Type:** 150px width
- **Location:** 150px width
- **Beds/Baths:** 85px width

---

## 8. RESPONSIVE BREAKPOINTS (Inferred)

```css
/* Desktop (≥1200px) */
.container {
  width: 1200px;
}

/* Tablet (768px - 1199px) */
@media (max-width: 1199px) {
  /* Adjustments for medium screens */
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  #mainSlider .slides li .captions .container .row {
    padding-right: 80px;
    font-size: 16px;
  }
  
  #mainSlider .flex-direction-nav {
    top: -120px;
  }
  
  .searchForm .form_elements {
    flex-direction: column;
  }
  
  .searchForm .form_element {
    min-width: 100%;
  }

  .searchForm .form_element button[type="submit"] {
    width: 100%;
    margin-top: 10px;
  }
}
```

---

## 9. TRANSITION & ANIMATION PROPERTIES

```css
/* Smooth transitions throughout */
a, .btn, button {
  -webkit-transition: all 300ms ease-in-out 0s;
  transition: all 300ms ease-in-out 0s;
}

a:hover, .btn:hover, button:hover {
  -webkit-transition: all 300ms ease-in-out 0s;
  transition: all 300ms ease-in-out 0s;
}
```

---

## 10. SPECIAL CONSIDERATIONS FOR REACT IMPLEMENTATION

### Key Components to Create:

1. **HeroSlider.jsx** - Main slider component
   - Use `react-slick`, `swiper`, or similar library instead of FlexSlider
   - Handle slide transitions
   - Manage navigation state

2. **PropertySearchForm.jsx** - Search form component
   - Manage form state with useState hooks
   - Handle filter selection
   - Handle search submission

3. **SliderCaption.jsx** - Caption overlay component
   - Position absolutely
   - Display price and details
   - Responsive positioning

### Libraries Recommended for React:
- `react-slick` (wrapper around Slick carousel)
- `swiper` (touch slider with React support)
- `react-spring` (animations)
- `react-hook-form` (form management)

### State Management Needed:
```javascript
// Slider state
const [currentSlide, setCurrentSlide] = useState(0);
const [autoPlay, setAutoPlay] = useState(true);

// Search form state
const [filters, setFilters] = useState({
  propertyType: '',
  location: '',
  beds: '',
  baths: '',
  sqft: '',
  minPrice: '',
  maxPrice: ''
});
```

---

## 11. ACCESSIBILITY NOTES

- Add `role="region"` to slider container
- Add `aria-label="Property slider"` to slider
- Add `alt` text to all images
- Ensure navigation buttons are keyboard accessible
- Add focus states to form inputs
- Use semantic HTML for form elements
- Include proper label associations with inputs

---

## 12. ADDITIONAL CSS UTILITIES USED

```css
/* Utility Classes */
.m0 { margin: 0; }
.p0 { padding: 0; }
.pt70 { padding-top: 70px; }
.fleft { float: left; }
.fright { float: right; }
.contentRow { padding: 25px 0 0; }
```

---

## 13. X-Browser Support Requirements

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (FlexSlider has IE support)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch device support for sliders
- CSS3 transforms and transitions

---

## Notes for Implementation

1. **Images:** Replace slider image paths with your actual property images
2. **Form Action:** Add proper API endpoint for search form submission
3. **Navigation:** Update link hrefs in captions to point to actual property pages
4. **Responsive:** The CSS uses flexbox and media queries - ensure proper mobile testing
5. **Performance:** Consider lazy-loading images for better performance
6. **Accessibility:** Add ARIA labels and keyboard navigation support
7. **Search Form:** The form selects use Bootstrap-select library for enhanced styling

