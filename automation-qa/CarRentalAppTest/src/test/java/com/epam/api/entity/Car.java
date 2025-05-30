package com.epam.api.entity;


import io.cucumber.java.mk_latn.No;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@ToString
public class Car {
    private String carId;
    private String model;
    private String imageUrl;
    private String location;
    private String pricePerDay;
    private String carRating;
    private String serviceRating;
    private String status;
}
