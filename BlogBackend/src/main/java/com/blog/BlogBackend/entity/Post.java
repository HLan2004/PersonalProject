package com.blog.BlogBackend.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Table(name="posts")
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @Column(name="post_title",length=120,nullable = false)
    private String title;

    @Column(length = 1000)
    private Date date;

    @Column(length = 1000)
    private String content;

    @Column(length = 1000)
    private String imageName;

    @Column(length = 70)
    private String cuisine;

    @Column
    private Integer duration;


    private Integer countLike;


    @ManyToOne
    @JoinColumn(name = "difficulty_id")
    private DifficultyCate difficultyCate;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private MealCate mealCate;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private Set<Comment> comSet = new HashSet<>();

}
