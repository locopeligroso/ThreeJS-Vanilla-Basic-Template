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
    return simplexNoise4d(vec4(warped * uPositionFrequency, uTime * uTimeFrequency)) * uStrength;
}

void main() {
    vec3 normalOS = normalize(normal);

    vec3 fallbackUp = abs(normalOS.y) > 0.999 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 tangentOS = normalize(cross(fallbackUp, normalOS));
    vec3 bitangentOS = normalize(cross(normalOS, tangentOS));

    float sampleOffset = max(0.02, uStrength * 0.25);

    vec3 basePos = position;
    vec3 samplePosT = basePos + tangentOS * sampleOffset;
    vec3 samplePosB = basePos + bitangentOS * sampleOffset;

    float wobbleBase = getWobble(basePos);
    float wobbleT = getWobble(samplePosT);
    float wobbleB = getWobble(samplePosB);

    vec3 displacedBase = basePos + normalOS * wobbleBase;
    vec3 displacedT = samplePosT + normalOS * wobbleT;
    vec3 displacedB = samplePosB + normalOS * wobbleB;

    vec3 dirToT = normalize(displacedT - displacedBase);
    vec3 dirToB = normalize(displacedB - displacedBase);
    vec3 normalDisplacedOS = normalize(cross(dirToB, dirToT));
    if (dot(normalDisplacedOS, normalOS) < 0.0) normalDisplacedOS = -normalDisplacedOS;

    csm_Position = displacedBase;
    csm_Normal = normalDisplacedOS;

    vWobble = wobbleBase / max(uStrength, 1e-6);
}
