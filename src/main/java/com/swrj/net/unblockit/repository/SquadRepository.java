package com.swrj.net.unblockit.repository;

import com.swrj.net.unblockit.domain.Squad;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Squad entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SquadRepository extends JpaRepository<Squad, Long> {}
