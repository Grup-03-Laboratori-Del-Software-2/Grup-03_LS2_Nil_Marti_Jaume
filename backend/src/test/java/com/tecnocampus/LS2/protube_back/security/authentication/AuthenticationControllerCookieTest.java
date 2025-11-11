package com.tecnocampus.LS2.protube_back.security.authentication;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "pro-tube.store-dir=c:",
        "pro-tube.load-initial-data=false"
})
@AutoConfigureMockMvc
class AuthenticationControllerCookieTest {

    @Autowired MockMvc mvc;
}
