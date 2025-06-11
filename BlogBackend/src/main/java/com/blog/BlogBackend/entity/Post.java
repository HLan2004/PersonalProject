package com.blog.BlogBackend.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.*;

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

    @Lob
    @Column(name = "image_data",
            columnDefinition = "LONGBLOB",
            nullable = false)
    @NonNull
    private byte[] imageData;

    @Column(name="image_type", length=100, nullable=false)
    private String imageType;

    @NonNull
    @Column(nullable = false,length = 70)
    private String cuisine;

    @NonNull
    @Column(nullable = false)
    private Integer duration;

    @NonNull
    @Column(nullable = false, length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "post_ingredients", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "ingredient", nullable = false)
    private List<String> ingredients = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Instruction> instructions = new ArrayList<>();

    private Integer countLike;

    @ElementCollection
    private Set<Long> likedUserIds = new HashSet<>();

    @Column(length = 1000)
    private Date date;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "difficulty_id")
    private DifficultyCate difficultyCate;

    @NonNull
    @ManyToOne
    @JoinColumn(name = "meal_id")
    private MealCate mealCate;

    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private Set<Comment> comSet = new HashSet<>();

}
