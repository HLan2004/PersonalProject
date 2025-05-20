package com.blog.BlogBackend.modelMapper;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConversion {


    @Bean
    public ModelMapper modelMapper() {return new ModelMapper();}

}
