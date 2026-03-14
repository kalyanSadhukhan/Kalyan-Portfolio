package com.kalyan.portfolio.service;

import com.kalyan.portfolio.entity.Hobby;
import com.kalyan.portfolio.repository.HobbyRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HobbyService {

    private final HobbyRepository hobbyRepository;

    public HobbyService(HobbyRepository hobbyRepository) {
        this.hobbyRepository = hobbyRepository;
    }

    public List<Hobby> getAllHobbies() {
        return hobbyRepository.findAllByOrderByRowOrderAsc();
    }

    public Hobby addHobby(Hobby hobby) {
        return hobbyRepository.save(hobby);
    }

    public Hobby updateHobby(Long id, Hobby updatedHobby) {
        Hobby hobby = hobbyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hobby not found"));
        
        hobby.setName(updatedHobby.getName());
        hobby.setIcon(updatedHobby.getIcon());
        hobby.setDescription(updatedHobby.getDescription());
        hobby.setRowOrder(updatedHobby.getRowOrder());
        
        return hobbyRepository.save(hobby);
    }

    public void reorderHobbies(List<Long> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Long id = ids.get(i);
            int order = i;
            hobbyRepository.findById(id).ifPresent(hobby -> {
                hobby.setRowOrder(order);
                hobbyRepository.save(hobby);
            });
        }
    }

    public void deleteHobby(Long id) {
        Hobby hobby = hobbyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hobby not found"));
        hobbyRepository.delete(hobby);
    }
}
