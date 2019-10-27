package com.tfg.entityservice;

import com.tfg.entityservice.adapters.QueueReceiver;
import com.tfg.entityservice.models.Sport;
import com.tfg.entityservice.repositories.SportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EntityserviceApplication {

	public static void main(String[] args) {
		try {
			QueueReceiver.main(args);
		} catch(Exception err) {
			System.err.print(err.toString());
		}
		SpringApplication.run(EntityserviceApplication.class, args);
	}

}
