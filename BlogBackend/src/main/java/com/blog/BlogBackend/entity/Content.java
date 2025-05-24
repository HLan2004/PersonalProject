package com.blog.BlogBackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "contents")
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column
    private String descriptionImage;

    @ElementCollection
    @CollectionTable(name = "content_ingredients", joinColumns = @JoinColumn(name = "content_id"))
    @Column(name = "ingredient", nullable = false)
    private List<String> ingredients = new ArrayList<>();

    @OneToMany(mappedBy = "content", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Instruction> instructions = new ArrayList<>();

    @OneToOne(mappedBy = "content")
    private Post post;
}