import emoji0DefaultBg from '../../assets/Home/img/emoji-0-default-bg.svg'
import emoji0DefaultMouth from '../../assets/Home/img/emoji-0-default-mouth.svg'
import emoji0DefaultShape from '../../assets/Home/img/emoji-0-default-shape.svg'
import emoji0SelectedBg from '../../assets/Home/img/emoji-0-selected-bg.svg'
import emoji0SelectedMouth from '../../assets/Home/img/emoji-0-selected-mouth.svg'
import emoji0SelectedShape from '../../assets/Home/img/emoji-0-selected-shape.svg'

import emoji1DefaultOutline from '../../assets/Home/img/emoji-1-default-outline.svg'
import emoji1DefaultEye from '../../assets/Home/img/emoji-1-default-eye.svg'
import emoji1SelectedOutline from '../../assets/Home/img/emoji-1-selected-outline.svg'
import emoji1SelectedEye from '../../assets/Home/img/emoji-1-selected-eye.svg'

import emoji2DefaultBg from '../../assets/Home/img/emoji-2-default-bg.svg'
import emoji2SelectedBg from '../../assets/Home/img/emoji-2-selected-bg.svg'

import emoji3DefaultBg from '../../assets/Home/img/emoji-3-default-bg.svg'
import emoji3DefaultLower from '../../assets/Home/img/emoji-3-default-lower.svg'
import emoji3DefaultUpper from '../../assets/Home/img/emoji-3-default-upper.svg'
import emoji3SelectedBg from '../../assets/Home/img/emoji-3-selected-bg.svg'
import emoji3SelectedLower from '../../assets/Home/img/emoji-3-selected-lower.svg'
import emoji3SelectedUpper from '../../assets/Home/img/emoji-3-selected-upper.svg'

import emoji4DefaultBg from '../../assets/Home/img/emoji-4-default-bg.svg'
import emoji4DefaultLower from '../../assets/Home/img/emoji-4-default-lower.svg'
import emoji4DefaultUpper from '../../assets/Home/img/emoji-4-default-upper.svg'
import emoji4SelectedBg from '../../assets/Home/img/emoji-4-selected-bg.svg'
import emoji4SelectedLower from '../../assets/Home/img/emoji-4-selected-lower.svg'
import emoji4SelectedUpper from '../../assets/Home/img/emoji-4-selected-upper.svg'

import emoji5DefaultBg from '../../assets/Home/img/emoji-5-default-bg.svg'
import emoji5DefaultEyeLeft from '../../assets/Home/img/emoji-5-default-eye-left.svg'
import emoji5DefaultEyeRight from '../../assets/Home/img/emoji-5-default-eye-right.svg'
import emoji5DefaultMouth from '../../assets/Home/img/emoji-5-default-mouth.svg'
import emoji5SelectedBg from '../../assets/Home/img/emoji-5-selected-bg.svg'
import emoji5SelectedEyeLeft from '../../assets/Home/img/emoji-5-selected-eye-left.svg'
import emoji5SelectedEyeRight from '../../assets/Home/img/emoji-5-selected-eye-right.svg'
import emoji5SelectedMouth from '../../assets/Home/img/emoji-5-selected-mouth.svg'

// Each layer is positioned by its top/left % (within the 46px face box, straight from
// Figma dev mode) and sized to its asset's own intrinsic px dimensions. We size from the
// SVG's own width/height rather than deriving it from "100% - top% - bottom%" because
// Figma's 2-decimal-place insets round very thin strokes (eyebrows, flat mouths) down to
// an exact 0px box, which made them invisible.
//
// The flat mouth/eyebrow lines (0.7px tall) are given `path` instead of `src`: rendered as
// an <img>, a sub-1px-tall SVG rasterizes as a faint, thin line (image decoder anti-aliasing),
// which made levels 1/2 look thinner than the rest even though every layer in this asset
// family shares the exact same stroke-width (0.7). Rendering them as live inline SVG instead
// of a rasterized image keeps the stroke crisp and matches the others' weight.
const rotateFlip = 'rotate(180deg) scaleX(-1)'
const STROKE_DEFAULT = '#558B71'
const STROKE_SELECTED = '#303030'
const flatLine = (x2, stroke) => ({
  path: { d: `M0.35 0.35H${x2}`, viewBox: [x2 + 0.35, 0.7], stroke },
})

export const emojiFaces = {
  0: {
    default: {
      bg: emoji0DefaultBg,
      layers: [
        { src: emoji0DefaultMouth, top: 39.13, left: 32.61, size: [16, 2] },
        { src: emoji0DefaultShape, top: 60.87, left: 30.43, size: [19.7, 5.2] },
      ],
    },
    selected: {
      bg: emoji0SelectedBg,
      layers: [
        { src: emoji0SelectedMouth, top: 39.13, left: 32.61, size: [16, 2] },
        { src: emoji0SelectedShape, top: 60.87, left: 30.43, size: [19.7, 5.2] },
      ],
    },
  },
  1: {
    default: {
      bg: emoji1DefaultOutline,
      layers: [
        { src: emoji1DefaultEye, top: 39.13, left: 32.61, size: [2, 2] },
        { src: emoji1DefaultEye, top: 39.13, left: 63.04, size: [2, 2] },
        { ...flatLine(14.35, STROKE_DEFAULT), top: 63.04, left: 34.78, size: [14.7, 0.7] },
      ],
    },
    selected: {
      bg: emoji1SelectedOutline,
      layers: [
        { src: emoji1SelectedEye, top: 39.13, left: 32.61, size: [2, 2] },
        { src: emoji1SelectedEye, top: 39.13, left: 63.04, size: [2, 2] },
        { ...flatLine(14.35, STROKE_SELECTED), top: 63.04, left: 34.78, size: [14.7, 0.7] },
      ],
    },
  },
  2: {
    default: {
      bg: emoji2DefaultBg,
      layers: [
        { ...flatLine(14.35, STROKE_DEFAULT), top: 63.04, left: 34.78, size: [14.7, 0.7] },
        { ...flatLine(3.35, STROKE_DEFAULT), top: 41.3, left: 32.61, size: [3.7, 0.7] },
        { ...flatLine(3.35, STROKE_DEFAULT), top: 41.3, left: 60.87, size: [3.7, 0.7] },
      ],
    },
    selected: {
      bg: emoji2SelectedBg,
      layers: [
        { ...flatLine(14.35, STROKE_SELECTED), top: 63.04, left: 34.78, size: [14.7, 0.7] },
        { ...flatLine(3.35, STROKE_SELECTED), top: 41.3, left: 32.61, size: [3.7, 0.7] },
        { ...flatLine(3.35, STROKE_SELECTED), top: 41.3, left: 60.87, size: [3.7, 0.7] },
      ],
    },
  },
  3: {
    default: {
      bg: emoji3DefaultBg,
      layers: [
        { src: emoji3DefaultLower, top: 58.7, left: 30.43, size: [19.7, 5.2], transform: rotateFlip },
        { src: emoji3DefaultUpper, top: 40.19, left: 32.81, size: [16.5193, 1.72626], transform: rotateFlip },
      ],
    },
    selected: {
      bg: emoji3SelectedBg,
      layers: [
        { src: emoji3SelectedLower, top: 58.7, left: 30.43, size: [19.7, 5.2], transform: rotateFlip },
        { src: emoji3SelectedUpper, top: 40.19, left: 32.81, size: [16.5193, 1.72626], transform: rotateFlip },
      ],
    },
  },
  4: {
    default: {
      bg: emoji4DefaultBg,
      layers: [
        { src: emoji4DefaultLower, top: 58.7, left: 30.43, size: [19.7, 5.2], transform: rotateFlip },
        { src: emoji4DefaultUpper, top: 41.3, left: 32.61, size: [16.5193, 1.72626], transform: rotateFlip },
      ],
    },
    selected: {
      bg: emoji4SelectedBg,
      layers: [
        { src: emoji4SelectedLower, top: 58.7, left: 30.43, size: [19.7, 5.2], transform: rotateFlip },
        { src: emoji4SelectedUpper, top: 41.3, left: 32.61, size: [16.5193, 1.72626], transform: rotateFlip },
      ],
    },
  },
  5: {
    default: {
      bg: emoji5DefaultBg,
      layers: [
        { src: emoji5DefaultEyeLeft, top: 39.13, left: 32.61, size: [4.70009, 3.70019] },
        { src: emoji5DefaultEyeRight, top: 39.13, left: 58.7, size: [4.70009, 3.70019], transform: 'scaleX(-1)' },
        { src: emoji5DefaultMouth, top: 60.87, left: 32.61, size: [16.2001, 2.70008] },
      ],
    },
    selected: {
      bg: emoji5SelectedBg,
      layers: [
        { src: emoji5SelectedEyeLeft, top: 39.13, left: 32.61, size: [4.70009, 3.70019] },
        { src: emoji5SelectedEyeRight, top: 39.13, left: 58.7, size: [4.70009, 3.70019], transform: 'scaleX(-1)' },
        { src: emoji5SelectedMouth, top: 60.87, left: 32.61, size: [16.2001, 2.70008] },
      ],
    },
  },
}
