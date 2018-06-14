float sphereMap( vec3 p, float radius )
{
  return length(p)- radius;
}
 
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{   
    // Fragment coordinate in NDC (Normalized Device Coordinates)
	// Coordinates of the fragment in the range of [-1,1]
    vec2 q = ( 2.0 * fragCoord.xy - iResolution.xy ) / iResolution.y;
        
    // ray origin
    // the camera position
    vec3 ro = vec3( 0.0, 0.0, 1.0 );
    
    // ray direction pointing deep in the scene (z < 0)
    // We want a unit vector to keep things tidy
    vec3 rd = normalize( vec3(q , -1.0) );
    
    // Default / background color
    vec3 col = vec3( 0.7, 0.8, 1.0 );

    // Raymarcher
    //
    // We stop raymarching if we are very far from the object.
    // This behaves a like your far clipping plane of a camera frustum
    float tmax = 125.0;
    // Acumulated distance to the object
    float t = 0.0;
    // We advance a maximum i steps in the direction of the ray
    for( int i=0; i<200; i++ )
    {
        // That's the current position over the ray
        // we move over the ray the previous distance
        // calculated to the object
        vec3 pos = ro + rd*t;
        // We evaluate how far we're from the objects
        // In this case we just have sphere of radius 0.5
        // centered in the origin
        float h = sphereMap( pos, 0.5 );
        // If h is very very small or negative we stop because we're either very close or inside the object
        // If t > tmax we stop as well because we're very far from it.
        if( h < 0.001 || t > tmax ) break;
        // It accumulates the distances to the object calculated in each step
        // We want this so for a rays passing close to an object but not hitting it. 
        // This cases might not trigger the t > max condition above and we could end up painting those pixels
        t += h;
    }

    // If t is less than the max distance we stablished we color the pixel
    if( t < tmax )
    {
        col = vec3( 1.0, 0.0, 0.0 );
    }

    // We set the final color of the pixel
	fragColor = vec4( col, 1.0 );
}
