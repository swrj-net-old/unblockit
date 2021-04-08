package com.swrj.net.unblockit.web.rest;

import com.swrj.net.unblockit.domain.Tarefa;
import com.swrj.net.unblockit.repository.TarefaRepository;
import com.swrj.net.unblockit.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.swrj.net.unblockit.domain.Tarefa}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TarefaResource {

    private final Logger log = LoggerFactory.getLogger(TarefaResource.class);

    private static final String ENTITY_NAME = "tarefa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TarefaRepository tarefaRepository;

    public TarefaResource(TarefaRepository tarefaRepository) {
        this.tarefaRepository = tarefaRepository;
    }

    /**
     * {@code POST  /tarefas} : Create a new tarefa.
     *
     * @param tarefa the tarefa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tarefa, or with status {@code 400 (Bad Request)} if the tarefa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tarefas")
    public ResponseEntity<Tarefa> createTarefa(@RequestBody Tarefa tarefa) throws URISyntaxException {
        log.debug("REST request to save Tarefa : {}", tarefa);
        if (tarefa.getId() != null) {
            throw new BadRequestAlertException("A new tarefa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tarefa result = tarefaRepository.save(tarefa);
        return ResponseEntity
            .created(new URI("/api/tarefas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tarefas/:id} : Updates an existing tarefa.
     *
     * @param id the id of the tarefa to save.
     * @param tarefa the tarefa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tarefa,
     * or with status {@code 400 (Bad Request)} if the tarefa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tarefa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tarefas/{id}")
    public ResponseEntity<Tarefa> updateTarefa(@PathVariable(value = "id", required = false) final Long id, @RequestBody Tarefa tarefa)
        throws URISyntaxException {
        log.debug("REST request to update Tarefa : {}, {}", id, tarefa);
        if (tarefa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tarefa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tarefaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Tarefa result = tarefaRepository.save(tarefa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tarefa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /tarefas/:id} : Partial updates given fields of an existing tarefa, field will ignore if it is null
     *
     * @param id the id of the tarefa to save.
     * @param tarefa the tarefa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tarefa,
     * or with status {@code 400 (Bad Request)} if the tarefa is not valid,
     * or with status {@code 404 (Not Found)} if the tarefa is not found,
     * or with status {@code 500 (Internal Server Error)} if the tarefa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/tarefas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Tarefa> partialUpdateTarefa(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Tarefa tarefa
    ) throws URISyntaxException {
        log.debug("REST request to partial update Tarefa partially : {}, {}", id, tarefa);
        if (tarefa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, tarefa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!tarefaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Tarefa> result = tarefaRepository
            .findById(tarefa.getId())
            .map(
                existingTarefa -> {
                    if (tarefa.getNome() != null) {
                        existingTarefa.setNome(tarefa.getNome());
                    }
                    if (tarefa.getDescricao() != null) {
                        existingTarefa.setDescricao(tarefa.getDescricao());
                    }
                    if (tarefa.getDataLimite() != null) {
                        existingTarefa.setDataLimite(tarefa.getDataLimite());
                    }
                    if (tarefa.getHoraLimite() != null) {
                        existingTarefa.setHoraLimite(tarefa.getHoraLimite());
                    }
                    if (tarefa.getSituacaoTarefa() != null) {
                        existingTarefa.setSituacaoTarefa(tarefa.getSituacaoTarefa());
                    }
                    if (tarefa.getObservacoes() != null) {
                        existingTarefa.setObservacoes(tarefa.getObservacoes());
                    }

                    return existingTarefa;
                }
            )
            .map(tarefaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tarefa.getId().toString())
        );
    }

    /**
     * {@code GET  /tarefas} : get all the tarefas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tarefas in body.
     */
    @GetMapping("/tarefas")
    public List<Tarefa> getAllTarefas() {
        log.debug("REST request to get all Tarefas");
        return tarefaRepository.findAll();
    }

    /**
     * {@code GET  /tarefas/:id} : get the "id" tarefa.
     *
     * @param id the id of the tarefa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tarefa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tarefas/{id}")
    public ResponseEntity<Tarefa> getTarefa(@PathVariable Long id) {
        log.debug("REST request to get Tarefa : {}", id);
        Optional<Tarefa> tarefa = tarefaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tarefa);
    }

    /**
     * {@code DELETE  /tarefas/:id} : delete the "id" tarefa.
     *
     * @param id the id of the tarefa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tarefas/{id}")
    public ResponseEntity<Void> deleteTarefa(@PathVariable Long id) {
        log.debug("REST request to delete Tarefa : {}", id);
        tarefaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
