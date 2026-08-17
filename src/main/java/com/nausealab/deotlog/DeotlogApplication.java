package com.nausealab.deotlog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DeotlogApplication {

	public static void main(String[] args) {

		System.out.println(System.getenv("DB_URL"));
		System.out.println(System.getenv("DB_USERNAME"));
		System.out.println(System.getenv("DB_PASSWORD"));

		SpringApplication.run(DeotlogApplication.class, args);
	}
}

