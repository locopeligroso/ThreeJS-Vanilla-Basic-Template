// + aggiungi
uniform float uTime;
uniform float uDeltaTime;
uniform sampler2D uBasePositions;
uniform float uFlowFieldInfluence;
uniform float uFlowFieldStrenght;
uniform float uFlowFieldFrequency;

#include ../includes/simplexNoise4d.glsl

void main() {
    float time = uTime * 0.2;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 particle = texture(uParticles, uv);
    vec4 basePositions = texture(uBasePositions, uv);

    float influence = (uFlowFieldInfluence - 0.5) * -2.0;

    if (particle.a >= 1.0) {
        particle.a = mod(particle.a, 1.0);
        particle.rgb = basePositions.rgb;
    }
    else {
        // Strenght
        float strenght = simplexNoise4d(vec4(basePositions.rgb * 0.25, time + 1.0));
        strenght = smoothstep(influence, 1.0, strenght);

        // Flow field
        vec3 flowField = vec3(
                simplexNoise4d(vec4(particle.rgb * uFlowFieldFrequency + 0.0, time)),
                simplexNoise4d(vec4(particle.rgb * uFlowFieldFrequency + 1.0, time)),
                simplexNoise4d(vec4(particle.rgb * uFlowFieldFrequency + 2.0, time))
            );

        flowField = normalize(flowField);
        particle.rgb += flowField * uDeltaTime * strenght * uFlowFieldStrenght;

        // Decay
        particle.a += uDeltaTime * 0.3;
    }

    gl_FragColor = particle;
}
