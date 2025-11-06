uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

varying float vWobble;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 p) {
    vec3 warped = p + simplexNoise4d(vec4(p * uWarpPositionFrequency, uTime * uWarpTimeFrequency)) * uWarpStrength;
    // low-freq -> smooth
    return simplexNoise4d(vec4(warped * uPositionFrequency, uTime * uTimeFrequency)) * uStrength;
}

void main() {
    // base frames (object space)
    vec3 n = normalize(normal);

    // costruisci tangente/bitangente “safe”
    vec3 up = abs(n.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 t = normalize(cross(up, n));
    vec3 b = normalize(cross(n, t));

    // campionamento per differenze finite
    float shift = max(0.02, uStrength * 0.25);

    vec3 p0 = position;
    vec3 pA = p0 + t * shift;
    vec3 pB = p0 + b * shift;

    float w0 = getWobble(p0);
    float wA = getWobble(pA);
    float wB = getWobble(pB);

    vec3 d0 = p0 + n * w0;
    vec3 dA = pA + n * wA;
    vec3 dB = pB + n * wB;

    vec3 toA = normalize(dA - d0);
    vec3 toB = normalize(dB - d0);
    vec3 nNew = normalize(cross(toB, toA));
    if (dot(nNew, n) < 0.0) nNew = -nNew;

    csm_Position = d0;
    csm_Normal = nNew;

    vWobble = w0 / max(uStrength, 1e-6);
}

