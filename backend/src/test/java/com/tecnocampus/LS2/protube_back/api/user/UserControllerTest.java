package com.tecnocampus.LS2.protube_back.api.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "pro-tube.store-dir=c:",
        "pro-tube.load-initial-data=false"
})
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired MockMvc mvc;

    @Test
    void register_ok() throws Exception {
        String body = """
        {
          "name":"Jaume",
          "surname":"Anglada",
          "email":"jangladag+ok@edu.tecnocampus.cat",
          "password":"Abc12345#",
          "dateOfBirth":"2002-05-25T11:00:00"
        }
        """;

        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("jangladag+ok@edu.tecnocampus.cat"))
                .andExpect(jsonPath("$.dateOfRegistration").exists());
    }

    @Test
    void register_email_duplicado_conflict_409() throws Exception {
        String body = """
        {
          "name":"Jaume",
          "surname":"Anglada",
          "email":"jangladag@edu.tecnocampus.cat",
          "password":"Abc12345#",
          "dateOfBirth":"2002-05-25T11:00:00"
        }
        """;

        // 1ª alta
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated());

        // 2ª alta (mismo email) -> 409 CONFLICT
        mvc.perform(post("/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isConflict());
    }
}
