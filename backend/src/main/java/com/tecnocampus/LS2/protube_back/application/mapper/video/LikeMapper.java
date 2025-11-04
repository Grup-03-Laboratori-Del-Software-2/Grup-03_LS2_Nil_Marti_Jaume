package com.tecnocampus.LS2.protube_back.application.mapper.video;

import com.tecnocampus.LS2.protube_back.application.dto.video.LikeDTO;
import com.tecnocampus.LS2.protube_back.domain.video.Like;

public class LikeMapper {

    public static LikeDTO likeToLikeDTO(Like like){
        return new LikeDTO(
                like.getUsername()
        );
    }
}
