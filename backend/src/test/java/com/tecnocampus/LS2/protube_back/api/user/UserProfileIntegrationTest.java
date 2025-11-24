package com.tecnocampus.LS2.protube_back.api.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "pro-tube.store-dir=c:",
        "pro-tube.load-initial-data=false"
})
@AutoConfigureMockMvc
class UserProfileIntegrationTest {

    @Autowired
    MockMvc mvc;

    @Test
    void updateProfile_changesNameSurnameAndEmail() throws Exception {
        String registerBody = """
                {
                  "name":"Jaume",
                  "surname":"Anglada",
                  "email":"profile.user@edu.tecnocampus.cat",
                  "password":"Abc12345#",
                  "dateOfBirth":"2002-05-25T11:00:00"
                }
                """;

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated());

        String loginBody = """
                {
                  "email": "profile.user@edu.tecnocampus.cat",
                  "password": "Abc12345#"
                }
                """;

        MvcResult loginResult = mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        String authHeader = loginResult.getResponse().getHeader("Authorization");
        assertThat(authHeader).isNotNull();

        String updateBody = """
                {
                  "name":"NouNom",
                  "surname":"NouCognom",
                  "email":"profile.user.updated@edu.tecnocampus.cat",
                  "dateOfBirth":"2000-01-01T00:00:00"
                }
                """;

        mvc.perform(put("/user/me")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("NouNom"))
                .andExpect(jsonPath("$.surname").value("NouCognom"))
                .andExpect(jsonPath("$.email").value("profile.user.updated@edu.tecnocampus.cat"));
    }

    @Test
    void changePassword_ok() throws Exception {
        String registerBody = """
                {
                  "name":"Pass",
                  "surname":"User",
                  "email":"changepass.user@edu.tecnocampus.cat",
                  "password":"Abc12345#",
                  "dateOfBirth":"2002-05-25T11:00:00"
                }
                """;

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated());

        String loginBody = """
                {
                  "email": "changepass.user@edu.tecnocampus.cat",
                  "password": "Abc12345#"
                }
                """;

        MvcResult loginResult = mvc.perform(post("/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andReturn();

        String authHeader = loginResult.getResponse().getHeader("Authorization");
        assertThat(authHeader).isNotNull();

        String changeBody = """
                {
                  "currentPassword": "Abc12345#",
                  "newPassword": "Xyz12345#"
                }
                """;

        mvc.perform(post("/user/change-password")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(changeBody))
                .andExpect(status().isNoContent());
    }
}
