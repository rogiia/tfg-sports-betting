package com.tfg.entityservice.controllers;

import com.tfg.entityservice.models.Sport;
import com.tfg.entityservice.repositories.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SportController {

    @Autowired
    private SportRepository sportRepository;

    @RequestMapping("/sport")
    public List<Sport> getSports() {
        List<Sport> result = new ArrayList<>();
        Iterable<Sport> sportIt = this.sportRepository.findAll();
        for (Sport item : sportIt)
            result.add(item);

        return result;
    }
}
