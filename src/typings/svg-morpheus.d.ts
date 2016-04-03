// Type definitions for SVG-Morpheus
// Project: https://github.com/alexk111/SVG-Morpheus
// Definitions by: Dashji <https://github.com/dashji>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

type Easing = 'linear'
    | 'circ-in' | 'circ-out' | 'circ-in-out' | 'cubic-in' | 'cubic-out' | 'cubic-in-out'
    | 'elastic-in' | 'elastic-out' | 'elastic-in-out' | 'expo-in' | 'expo-out' | 'expo-in-out'
    | 'quad-in' | 'quad-out' | 'quad-out' | 'quart-in' | 'quart-out' | 'quart-in-out'
    | 'quint-in' | 'quint-out' | 'quint-in-out' | 'sine-in' | 'sine-out' | 'sine-in-out';

type Rotation = 'clock' | 'counterclock' | 'random' | 'none';

interface SVGMorpheusToOptions {
    duration?: number;
    easing?: Easing;
    roration?: Rotation;
}

interface SVGMorpheusOptions extends SVGMorpheusToOptions {
    iconId?: string;
}

interface SVGMorpheus {
    new(element: any, options?: SVGMorpheusOptions, callback?: () => void): SVGMorpheus;
    to(iconId: string, options?: SVGMorpheusToOptions, callback?: () => void) : void;
}

declare var SVGMorpheus: SVGMorpheus;
