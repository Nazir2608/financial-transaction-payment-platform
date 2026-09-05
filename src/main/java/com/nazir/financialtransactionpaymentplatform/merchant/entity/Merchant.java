package com.nazir.financialtransactionpaymentplatform.merchant.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="merchants")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false,length = 255)
    private String email;

    @Column(nullable = false,length = 20)
    private String phone;

    @Column(name = "business_name",nullable = false,length = 200)
    private String businessName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private MerchantStatus status;

    @Column(name = "create_at",nullable = false,updatable = false)
    private Instant createdAt;

    @Column(name = "update_at",nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void createOn(){
        Instant now=Instant.now();
        createdAt=now;
        updatedAt=now;

        if (status==null){
            status=MerchantStatus.ACTIVE;
        }
    }

    @PostPersist
    protected void updateOn(){
        updatedAt= Instant.now();
    }



}
