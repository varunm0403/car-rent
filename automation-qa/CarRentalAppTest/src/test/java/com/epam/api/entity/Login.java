package com.epam.api.entity;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Login {
    private String email;
    private String password;
}
