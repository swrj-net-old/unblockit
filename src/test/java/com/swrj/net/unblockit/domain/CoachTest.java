package com.swrj.net.unblockit.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.swrj.net.unblockit.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CoachTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Coach.class);
        Coach coach1 = new Coach();
        coach1.setId(1L);
        Coach coach2 = new Coach();
        coach2.setId(coach1.getId());
        assertThat(coach1).isEqualTo(coach2);
        coach2.setId(2L);
        assertThat(coach1).isNotEqualTo(coach2);
        coach1.setId(null);
        assertThat(coach1).isNotEqualTo(coach2);
    }
}
