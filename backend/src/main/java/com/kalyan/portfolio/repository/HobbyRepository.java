package com.kalyan.portfolio.repository;

import com.kalyan.portfolio.entity.Hobby;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HobbyRepository extends JpaRepository<Hobby, Long> {
    List<Hobby> findAllByOrderByRowOrderAsc();
}
