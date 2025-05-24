package com.blog.BlogBackend.entity;


import jakarta.persistence.*;
import lombok.*;

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
    private String imageName;

    @NonNull
    @Column(nullable = false,length = 70)
    private String cuisine;

    @NonNull
    @Column(nullable = false)
    private Integer duration;

    @NonNull
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "content_id", referencedColumnName = "id")
    private Content content;


    private Integer countLike;

    @ElementCollection
    private Set<Long> likedUserIds = new HashSet<>();

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
