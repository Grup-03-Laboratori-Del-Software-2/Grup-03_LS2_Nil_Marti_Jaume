package com.tecnocampus.LS2.protube_back.domain.user;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
public class Role {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private ERole name;

    protected Role() {}
    public Role(ERole name){ this.name = name; }

    public Long getId(){ return id; }
    public ERole getName(){ return name; }
}
