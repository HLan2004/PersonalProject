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
@RequiredArgsConstructor
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @NonNull
    @Column(name="post_title",length=120,nullable = false)
    private String title;

    @NonNull
    @Column(nullable = false, length = 1000)
    private String content;

    @NonNull
    @Column(nullable = false, length = 1000)
    private String imageName;

    @NonNull
    @Column(nullable = false,length = 70)
    private String cuisine;

    @NonNull
    @Column(nullable = false)
    private Integer duration;


    private Integer countLike;

    @Column(length = 1000)
    private Date date;



    @ManyToOne
    @JoinColumn(name = "difficulty_id")
    private DifficultyCate difficultyCate;

    @ManyToOne
    @JoinColumn(name = "meal_id")
    private MealCate mealCate;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private Set<Comment> comSet = new HashSet<>();

}
