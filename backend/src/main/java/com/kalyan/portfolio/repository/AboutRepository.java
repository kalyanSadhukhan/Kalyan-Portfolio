package com.kalyan.portfolio.repository;
import com.kalyan.portfolio.entity.About;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AboutRepository extends JpaRepository<About, Long> {
}