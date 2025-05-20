package com.blog.BlogBackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "difficulty_cate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DifficultyCate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String difficultyTitle;


    @OneToMany(mappedBy = "difficultyCate", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Post> posts = new ArrayList<>();
}
