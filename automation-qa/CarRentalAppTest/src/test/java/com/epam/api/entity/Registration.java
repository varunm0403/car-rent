package com.epam.api.entity;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class Registration {
    private String email;
    private String firstName;
    private String lastName;
    private String password;
}
