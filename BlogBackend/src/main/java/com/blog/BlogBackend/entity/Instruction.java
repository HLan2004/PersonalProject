package com.blog.BlogBackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "instructions")
public class Instruction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String step;

    @Column
    private String image;

    @ManyToOne
    @JoinColumn(name = "content_id")
    private Content content;
}
