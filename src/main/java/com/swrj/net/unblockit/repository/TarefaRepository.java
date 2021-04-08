package com.swrj.net.unblockit.repository;

import com.swrj.net.unblockit.domain.Tarefa;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Tarefa entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {}
