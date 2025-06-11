package com.blog.BlogBackend.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="meal_cate")
public class MealCate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String mealCateTitle;


    @JsonIgnore
    @OneToMany(mappedBy = "mealCate",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Post> mealCateList = new ArrayList<>();

}
