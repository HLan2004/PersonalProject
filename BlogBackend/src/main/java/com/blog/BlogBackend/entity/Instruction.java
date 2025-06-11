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
    private String stepDescription;

    private Integer stepOrder;

    @Lob
    @Column(name="step_image_data", columnDefinition="LONGBLOB")
    private byte[] stepImageData;

    @Column(name="step_image_type", length=100)
    private String stepImageType;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;
}