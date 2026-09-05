package com.nazir.financialtransactionpaymentplatform.customer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "customers")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CustomerStatus status;

    @Column(name = "create_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "update_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted;

    @PrePersist
    protected void createOn() {

        Instant now = Instant.now();

        createdAt = now;
        updatedAt = now;

        if (status == null) {
            status = CustomerStatus.ACTIVE;
        }

        deleted = false;
    }

    @PreUpdate
    protected void updateOn() {

        updatedAt = Instant.now();
    }
}