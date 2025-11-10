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

    @Test
    void login_setCookie_and_me_with_cookie_ok() throws Exception {
        String registerBody = """
            {
              "name":"User",
              "surname":"Test",
              "email":"user.cookie@test.com",
              "password":"Abc12345#",
              "dateOfBirth":"2000-01-01T00:00:00"
            }
        """;

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated());

        String loginBody = """
            {"email":"user.cookie@test.com","password":"Abc12345#"}
        """;

        var loginResp = mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(header().exists("Set-Cookie"))
                .andReturn();

        String setCookie = loginResp.getResponse().getHeader("Set-Cookie");
        assertThat(setCookie).isNotBlank();

        mvc.perform(get("/user/me").header("Cookie", setCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user.cookie@test.com"));
    }
}
