varying vec3 vColor;

void main()
{
    vec2 uv = gl_PointCoord;
    float distanceoCenter = length(uv - 0.5);

    float alpha = 0.05 / distanceoCenter - 0.1;

    gl_FragColor = vec4(vec3(vColor), alpha);

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}

