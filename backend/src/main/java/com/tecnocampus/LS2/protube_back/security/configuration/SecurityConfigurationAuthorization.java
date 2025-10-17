package com.tecnocampus.LS2.protube_back.security.configuration;

import com.tecnocampus.LS2.protube_back.security.authentication.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import static org.springframework.security.oauth2.core.authorization.OAuth2AuthorizationManagers.hasAnyScope;
import static org.springframework.security.oauth2.core.authorization.OAuth2AuthorizationManagers.hasScope;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfigurationAuthorization {
    private final CustomUserDetailsService userDetailsService;
    private final JwtDecoder jwtDecoder;
    private static final String[] WHITE_LIST_URL = {
            "/register",
            "/h2-console/**",
            "/webjars/**",
            "/v3/api-docs/**", //this is for swagger
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/user/register",
            "/user/login",
            "/user/role/{role}",
            "/user/me",
            "/user/me2"};

    private static final String[] FREE_LIST_URL_GET = {
            //User Controller
            "/user/activity",

            //Album Controller
            "/album/{id}/visibility",
            "/album/available",
            "/album/{albumId}", //get album complete

            //Section Controller
            "/album/{albumId}/section", //view sections from an album

            //Sticker Controller
            "/album/{albumId}/section/{sectionId}/sticker", //get all stickers form an album section
            "/album/{albumId}/sticker/{stickerNumber}", //get sticker from public album through it's number

            //Collection Controller
            "/user/collection", //get the collections from the user
            "/user/album/collection", //get the open album user collections (available within time period and public)
            "/user/collections/complete", //get all albums being collected with user stickers
            "/user/album/{idAlbum}/collection", //get entire collection sticker
            "/user/album/{idAlbum}/collection/obtained", //get all collected stickers
            "/user/album/{idAlbum}/collection/missing", //get all missing stickers

            //Forum Controller
            "/forum/**", //allow users get any type of content from a forum

            //Exchange Controller
            "/exchange/spare/album/{albumId}/sticker/{stickerNumber}", //get users with spare copies
            "/exchange/spare/user/{emailMissing}/album/{albumId}", //get my spare copies of an album another user does not have
            "/exchange/proposal", //get all user exchange proposals available
            "/exchange/proposal/all", //get all user exchange proposals ever

            //Sale Controller
            "/sale", //the user can see the sales, but not create
            "/user/album/{albumId}/sale" //user can see the sales, but not create
    };

    private static final String[] FREE_LIST_URL_POST = {
            //Collection Controller
            "/user/album/{albumId}/collection", //add sticker to collection

            //Forum Controller
            "/forum/**", //allow users to post to a forum, register and unregister

            //Exchange Controller
            "/exchange/proposal" //create a exchange proposal, maximum two for free user
    };

    private static final String[] FREE_LIST_URL_PUT = {
            //User Controller
            "/user/update",
            "/user/block/**", //block a user
            "/user/unblock/**", //unblock an already blocked user

            //Exchange Controller
            "/proposal/{exchangeId}/accept",
            "/proposal/{exchangeId}/deny"
    };

    ////

    private static final String[] PREMIUM_LIST_URL_GET = {
            //Album Controller
            "/album/user", //get all user albums

            //MessageDirect Controller
            "/messagedirect/**",

            //Exchange Controller
            "/exchange/**"
    };

    private static final String[] PREMIUM_LIST_URL_POST = {
            //Album Controller
            "/album", //create an album

            //Section Controller
            "/album/{albumId}/section", //create a section

            //Sticker Controller
            "/album/{albumId}/section/{sectionId}/sticker", //create a sticker

            //MessageDirect Controller
            "/messagedirect/**",

            //Exchange Controller
            "/exchange/**",

            //Sale Controller
            "/user/album/{albumId}/sale", //create a sale
            "/user/sale/{saleId}" // purchase a sticker
    };

    // ------------------------

    private static final String[] FREE_LIST_URL = { //For free users


            //Album Controller
                //visibility
                //available
                //user
                //{albumId}

            //Section Controller

            //Sticker Controller

            "/user/collection", //get user collections
            "/user/album", //get all user albums?
            "/user/album/collection", //get open user collections
            "/user/album/{albumId}/collection", //add sticker to album collection/ view all stickers of collection
            "/user/album/{albumId}/collection/bestThreeExchangers", //view best three users to exchange
            "/user/album/{albumId}/collection/obtained", //view all obtained sickers of collection
            "/user/album/{albumId}/collection/missing", //view all missing sickers of collection
            "/user/album/{albumId}/collection/obtained", //view all obtained sickers of collection//
            "/forum/{albumId}/register", //register user to forum
            "/forum/{albumId}/unregister", //unregister user to forum
            "/forum/{albumId}/writeMessages", // write messages to forum
            "/forum/{albumId}/listMessages", //list messages of forum
            "/user/album/ * /section/ * /sticker", //get available stickers / add sticker to section
            "/user/album/{albumId}/section", //get all album sections
            "/album/available", //get all available album
            "/user/album/{albumId}", //get album complete
            "/user/album", //add album to collection user
            "/user/block/{blockedUserEmail}", //block a user
            "/user/unblock/{unblockedUserEmail}", //unblock an already blocked user
            "/exchange/**" //exchange services
    };

    private static final String[] PREMIUM_LIST_URL = { //For premium users
            "/messagedirect/**", //any action on direct message
            "/user/album/{albumId}/sale",
            "/user/sale/{saleId}",
            "/user/album/{albumId}/sale",
            "/sale"
    };

    private static final String[] ADMIN_LIST_URL = { //For admin users
            "/**"
            //User Controller
            //"/user"
            //"/user/{startDate}/{endDate}",

            //Album Controller
            //"/album"

            //Section Controller
            //"/section"

            //Sticker Controller
            //"/sticker"

            //Collection Controller
            //"/collection"
            //"/user/album/{albumId}/collection_users" //get all users collecting an album

            //MessageDirect Controller
            //all allowed in premium
    };

    public SecurityConfigurationAuthorization(CustomUserDetailsService userDetailsService, JwtDecoder jwtDecoder) {
        this.userDetailsService = userDetailsService;
        this.jwtDecoder = jwtDecoder; }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.disable())
                .csrf(csrf -> csrf.disable()) //This is to disable the csrf protection. It is not needed for this project since the application is stateless (and we are using JWT)
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions
                        .sameOrigin()))   // This is to allow the h2-console to be used in the browser. It allows the browser to render the response in a frame.
                .authorizeHttpRequests(auth -> {

                    String message = auth.toString();
                    System.out.println(message);

                    auth.requestMatchers(WHITE_LIST_URL).permitAll();
                    //auth.requestMatchers(FREE_LIST_URL).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));
                    //auth.requestMatchers(PREMIUM_LIST_URL).access(hasAnyScope("PREMIUM", "ADMIN"));
                    //auth.requestMatchers(ADMIN_LIST_URL).access(hasScope("ADMIN"));
                    /*
                    auth.requestMatchers(FREE_LIST_URL_GET).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));
                    auth.requestMatchers(FREE_LIST_URL_POST).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));
                    auth.requestMatchers(FREE_LIST_URL_PUT).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));

                    auth.requestMatchers(PREMIUM_LIST_URL_GET).access(hasAnyScope("PREMIUM", "ADMIN"));
                    auth.requestMatchers(PREMIUM_LIST_URL_POST).access(hasAnyScope("PREMIUM", "ADMIN"));

                    auth.requestMatchers(ADMIN_LIST_URL).access(hasScope("ADMIN"));
                    */

                    auth.requestMatchers(GET, FREE_LIST_URL_GET).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));
                    auth.requestMatchers(POST, FREE_LIST_URL_POST).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));
                    auth.requestMatchers(PUT, FREE_LIST_URL_PUT).access(hasAnyScope("FREE", "PREMIUM", "ADMIN"));

                    auth.requestMatchers(GET, PREMIUM_LIST_URL_GET).access(hasAnyScope("PREMIUM", "ADMIN"));
                    auth.requestMatchers(POST, PREMIUM_LIST_URL_POST).access(hasAnyScope("PREMIUM", "ADMIN"));

                    auth.requestMatchers(ADMIN_LIST_URL).access(hasScope("ADMIN"));

                    /*auth.requestMatchers("/user/register").permitAll();
                    auth.requestMatchers("/user/login").permitAll();
                    auth.requestMatchers("/user/album").access(hasScope("ADMIN"));*/
                    auth.anyRequest().authenticated();
                })
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer((oauth2) -> oauth2.jwt((jwt) -> jwt.decoder(jwtDecoder)))
                .httpBasic(Customizer.withDefaults())
                .build();
    }
}
