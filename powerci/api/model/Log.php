<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Collection;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\PresenceOf as PresenceValidation;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class Log extends Collection
{
    public function fillMe($str, $token) {
    	if (count(explode("/", $str)) >= 4 && explode("/", $str)[3] == "log")
    		return false;
        $this->message = (strlen($str) == 0) ? "NA" : $str;
        $this->token = (strlen($token) == 0) ? "NA" : $token;
        $this->date = time();
        return true;
    }
}
?>