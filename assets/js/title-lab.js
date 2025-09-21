const preview = document.querySelector('#preview');
const svgOutput = document.querySelector('#svg-output');
const presetRow = document.querySelector('#preset-row');
const savedPresetsContainer = document.querySelector('#saved-presets');
const toast = document.querySelector('#toast');

const STORAGE_KEY = 'title-forge-state-v1';
const PRESET_STORAGE_KEY = 'title-forge-presets-v1';

const defaultState = {
  text: 'Aurora Bloom',
  fontFamily: 'Manrope',
  fontWeight: 700,
  fontSize: 82,
  letterSpacing: 8,
  lineHeight: 120,
  uppercase: false,
  showStroke: false,
  strokeColor: '#f5f6f8',
  strokeWidth: 1.2,
  slant: 0,
  gradientStart: '#ff7bd5',
  gradientEnd: '#00f6ff',
  gradientAngle: 32,
  glowStrength: 28,
  shadowStrength: 36,
  backgroundStyle: 'halo',
  backgroundStart: '#181d37',
  backgroundEnd: '#0b111f',
  backgroundBlur: 18,
  waveScale: 14,
  waveDetail: 58,
};

const curatedPresets = [
  {
    name: 'Neon Bloom',
    state: {
      ...defaultState,
      text: 'Neon Bloom',
      fontFamily: 'Syne',
      fontWeight: 700,
      fontSize: 94,
      letterSpacing: 10,
      gradientStart: '#ff7bd5',
      gradientEnd: '#7effb2',
      gradientAngle: 64,
      glowStrength: 34,
      shadowStrength: 40,
      backgroundStyle: 'orbits',
      backgroundStart: '#12172f',
      backgroundEnd: '#030510',
      waveScale: 18,
      waveDetail: 45,
    },
  },
  {
    name: 'Noir Vogue',
    state: {
      ...defaultState,
      text: 'Noir Vogue',
      fontFamily: 'Playfair Display',
      fontWeight: 600,
      fontSize: 110,
      letterSpacing: 4,
      gradientStart: '#ffeedb',
      gradientEnd: '#ff7bd5',
      gradientAngle: 16,
      glowStrength: 12,
      shadowStrength: 24,
      backgroundStyle: 'halo',
      backgroundStart: '#1a0b19',
      backgroundEnd: '#0a0a15',
      waveScale: 6,
      waveDetail: 28,
    },
  },
  {
    name: 'Cyber Drift',
    state: {
      ...defaultState,
      text: 'Cyber Drift',
      fontFamily: 'Space Grotesk',
      fontWeight: 600,
      fontSize: 88,
      letterSpacing: 6,
      gradientStart: '#00f6ff',
      gradientEnd: '#5c6cff',
      gradientAngle: 92,
      glowStrength: 20,
      shadowStrength: 52,
      backgroundStyle: 'bars',
      backgroundStart: '#0b1124',
      backgroundEnd: '#060a16',
      waveScale: 22,
      waveDetail: 70,
    },
  },
  {
    name: 'Sunset Script',
    state: {
      ...defaultState,
      text: 'Sunset Script',
      fontFamily: 'Pacifico',
      fontWeight: 400,
      fontSize: 100,
      letterSpacing: 2,
      gradientStart: '#ffa54c',
      gradientEnd: '#ff7bd5',
      gradientAngle: 120,
      glowStrength: 26,
      shadowStrength: 18,
      backgroundStyle: 'halo',
      backgroundStart: '#1b1034',
      backgroundEnd: '#21103d',
      waveScale: 10,
      waveDetail: 36,
    },
  },
];

let state = loadState();
let savedPresets = loadSavedPresets();

const controls = document.querySelectorAll('[data-key]');
const numericDisplays = new Map();

document.querySelectorAll('.slider-row span[data-for]').forEach((span) => {
  numericDisplays.set(span.dataset.for, span);
});

controls.forEach((control) => {
  const key = control.dataset.key;
  if (key in state) {
    if (control.type === 'checkbox') {
      control.checked = Boolean(state[key]);
    } else {
      control.value = state[key];
    }
  }

  if (control.type === 'range') {
    updateNumericDisplay(control.id, control.value, control.step);
    control.addEventListener('input', (event) => handleInput(event, false));
    control.addEventListener('change', handleInput);
  }

  if (control.type === 'color' || control.type === 'select-one' || control.type === 'text' || control.tagName === 'TEXTAREA') {
    control.addEventListener('input', handleInput);
  }
  if (control.type === 'checkbox') {
    control.addEventListener('change', handleInput);
  }
});

bindButton('#copy-svg', copySVG);
bindButton('#download-svg', downloadSVG);
bindButton('#save-preset', saveCurrentPreset);

renderPresetChips();
renderSavedPresets();
renderPreview();

function handleInput(event, persist = true) {
  const input = event.target;
  const key = input.dataset.key;
  if (!key) return;

  let value;
  if (input.type === 'checkbox') {
    value = input.checked;
  } else if (input.type === 'range') {
    value = parseFloat(input.value);
    updateNumericDisplay(input.id, value, input.step);
  } else {
    value = input.value;
  }

  state = { ...state, [key]: value };
  persist && saveState();
  highlightPreset(-1);
  toggleVisibility();
  renderPreview();
}

function toggleVisibility() {
  const showStroke = Boolean(state.showStroke);
  document.querySelectorAll('[data-visible-when="showStroke"]').forEach((element) => {
    element.style.display = showStroke ? 'flex' : 'none';
  });
}

function renderPreview() {
  const svgMarkup = createSVG(state);
  preview.innerHTML = svgMarkup;
  svgOutput.value = svgMarkup;
}

function createSVG(current) {
  const width = 960;
  const height = 540;
  const textContent = (current.uppercase ? current.text.toUpperCase() : current.text) || 'Title Forge';
  const lines = textContent
    .split('\n')
    .map((line) => (line.length ? line : ' '));
  const lineHeightPx = (current.lineHeight / 100) * current.fontSize;
  const strokeAttrs = current.showStroke
    ? ` stroke="${current.strokeColor}" stroke-width="${current.strokeWidth}" stroke-linejoin="round" paint-order="stroke fill"`
    : '';
  const totalHeight = (lines.length - 1) * lineHeightPx;
  const firstDy = lines.length > 1 ? -totalHeight / 2 : 0;

  const textSpans = lines
    .map((line, index) => {
      const dy = index === 0 ? firstDy : lineHeightPx;
      return `<tspan x="50%" dy="${dy}" dominant-baseline="middle">${escapeXML(line)}</tspan>`;
    })
    .join('');

  const defs = `
    <defs>
      <linearGradient id="fillGradient" gradientUnits="objectBoundingBox" gradientTransform="rotate(${current.gradientAngle})">
        <stop offset="0%" stop-color="${current.gradientStart}" />
        <stop offset="100%" stop-color="${current.gradientEnd}" />
      </linearGradient>
      <linearGradient id="backgroundGradient" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="${current.backgroundStart}" />
        <stop offset="100%" stop-color="${current.backgroundEnd}" />
      </linearGradient>
      <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="${current.shadowStrength / 16}" stdDeviation="${current.shadowStrength / 12}" flood-color="#070c17" flood-opacity="0.85" />
      </filter>
      <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur stdDeviation="${current.glowStrength / 12}" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="wave" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="${current.waveDetail / 200}" numOctaves="2" seed="8" />
        <feDisplacementMap in="SourceGraphic" scale="${current.waveScale}" xChannelSelector="R" yChannelSelector="B" />
      </filter>
      <filter id="backgroundBlur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="${current.backgroundBlur / 8}" />
      </filter>
    </defs>`;

  const background = renderBackground(current, width, height);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg id="title-art" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXML(
    textContent
  )}">
  ${defs}
  <rect width="${width}" height="${height}" fill="url(#backgroundGradient)" rx="48" filter="url(#backgroundBlur)" />
  ${background}
  <g filter="url(#shadow)">
    <g filter="url(#wave)">
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="url(#fillGradient)" font-family="${escapeXML(
    current.fontFamily
  )}" font-size="${current.fontSize}" font-weight="${current.fontWeight}" letter-spacing="${current.letterSpacing}" ${strokeAttrs} filter="url(#glow)" transform="skewX(${current.slant})">
        ${textSpans}
      </text>
    </g>
  </g>
</svg>`;
}

function renderBackground(current, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;

  switch (current.backgroundStyle) {
    case 'halo':
      return `
      <g opacity="0.85">
        <circle cx="${centerX}" cy="${centerY}" r="220" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="36" />
        <circle cx="${centerX}" cy="${centerY}" r="${Math.max(current.fontSize * 2, 180)}" fill="url(#fillGradient)" opacity="0.2" />
      </g>`;
    case 'orbits':
      return `
      <g opacity="0.75">
        <circle cx="${centerX}" cy="${centerY}" r="${Math.max(current.fontSize * 1.7, 180)}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="8" stroke-dasharray="24 18" />
        <circle cx="${centerX}" cy="${centerY}" r="${Math.max(current.fontSize * 1.2, 140)}" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="4" stroke-dasharray="8 16" />
        <circle cx="${centerX}" cy="${centerY}" r="${Math.max(current.fontSize * 0.9, 100)}" fill="rgba(255,255,255,0.05)" />
      </g>`;
    case 'bars':
      return `
      <g opacity="0.75">
        <rect x="${centerX - 420}" y="${centerY - 200}" width="840" height="80" rx="40" fill="url(#fillGradient)" opacity="0.18" />
        <rect x="${centerX - 320}" y="${centerY + 40}" width="640" height="80" rx="40" fill="url(#fillGradient)" opacity="0.24" />
        <rect x="${centerX - 220}" y="${centerY - 360}" width="440" height="60" rx="30" fill="url(#fillGradient)" opacity="0.18" />
      </g>`;
    default:
      return '';
  }
}

function escapeXML(input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultState, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.warn('Unable to load saved state', error);
  }
  return { ...defaultState };
}

function loadSavedPresets() {
  try {
    const stored = localStorage.getItem(PRESET_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Unable to load saved presets', error);
  }
  return [];
}

function saveCurrentPreset() {
  const nameInput = document.querySelector('#preset-name');
  const name = nameInput.value.trim();
  if (!name) {
    showToast('Name your preset first ✍️');
    return;
  }

  const preset = { name, state: { ...state } };
  savedPresets = [preset, ...savedPresets.filter((item) => item.name !== name)].slice(0, 15);
  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(savedPresets));
  renderSavedPresets();
  nameInput.value = '';
  showToast('Preset saved ✅');
}

function renderPresetChips() {
  presetRow.innerHTML = '';
  curatedPresets.forEach((preset, index) => {
    const button = document.createElement('button');
    button.className = 'preset-chip';
    button.textContent = preset.name;
    button.addEventListener('click', () => {
      applyState(preset.state);
      highlightPreset(index);
    });
    presetRow.appendChild(button);
  });
  highlightPreset(-1);
}

function renderSavedPresets() {
  savedPresetsContainer.innerHTML = '';
  if (!savedPresets.length) {
    savedPresetsContainer.innerHTML = '<p class="text-muted">No saved presets yet.</p>';
    return;
  }
  savedPresets.forEach((preset) => {
    const button = document.createElement('button');
    button.className = 'preset-chip';
    button.textContent = preset.name;
    button.addEventListener('click', () => {
      applyState(preset.state);
      highlightPreset(-1);
    });
    savedPresetsContainer.appendChild(button);
  });
}

function highlightPreset(activeIndex) {
  const chips = presetRow.querySelectorAll('.preset-chip');
  chips.forEach((chip, index) => {
    chip.classList.toggle('active', index === activeIndex);
  });
}

function applyState(newState) {
  state = { ...state, ...newState };
  controls.forEach((control) => {
    const key = control.dataset.key;
    if (key in state) {
      if (control.type === 'checkbox') {
        control.checked = Boolean(state[key]);
      } else {
        control.value = state[key];
      }
      if (control.type === 'range') {
        updateNumericDisplay(control.id, control.value, control.step);
      }
    }
  });
  saveState();
  toggleVisibility();
  renderPreview();
}

function bindButton(selector, handler) {
  const button = document.querySelector(selector);
  if (!button) return;
  button.addEventListener('click', handler);
}

function copySVG() {
  const svgMarkup = svgOutput.value;
  navigator.clipboard
    .writeText(svgMarkup)
    .then(() => showToast('SVG copied to clipboard ✨'))
    .catch(() => showToast('Could not copy. Try manually copying the code.'));
}

function downloadSVG() {
  const svgMarkup = svgOutput.value;
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${slugify(state.text || 'title-art')}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('SVG downloaded ⬇️');
}

function slugify(text) {
  return (text || 'title-art')
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'title-art';
}

function updateNumericDisplay(id, value, step = 1) {
  const display = numericDisplays.get(id);
  if (!display) return;
  const numericValue = Number(value);
  const decimals = step && String(step).includes('.') ? 1 : 0;
  display.textContent = Number.isFinite(numericValue) ? numericValue.toFixed(decimals) : value;
}

function bindGlobalShortcuts() {
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c') {
      if (document.activeElement === document.body) {
        event.preventDefault();
        copySVG();
      }
    }
  });
}

bindGlobalShortcuts();
toggleVisibility();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 1800);
}
