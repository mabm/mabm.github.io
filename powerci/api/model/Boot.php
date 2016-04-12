<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Collection;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;


class Boot extends Collection
{
  private $fields = array("boot_result", "kernel", "test_desc", "arch", "power_stats", "endian", "lava_bundle", "boot_warnings", "defconfig", "lab_name", "job", "version", "board", "boot_time", "boot_log", "defconfig_full", "uimage_addr", "initrd", "load_addr", "quemu", "file_server_url", "build_id", "job_id", "fastboot", "dtb_append", "boot_result_description", "dtb_addr", "fastboot_cmd", "warnings", "initrd_addr", "kernel_image", "board_instance", "git_describe", "mach", "boot_log_html", "retries", "file_server_resource", "test_plan", "dtb", "uimage", "git_branch", "git_commit", "qemu_command", "kernel_image_size", "git_url", "energy", "power_max", "current_min", "current_max", "power_min", "vbus_max", "data", "filename");

    public function fillMe($obj) {
         $arrayIsPresent = false;

       foreach ($obj as $key => $value) {
            if (is_array($obj->{$key}) && in_array($key, $this->fields)) {
                $localObj = "";
                if (!property_exists($this, $key))
                    $this->{$key} = array();
                foreach ($value as $key2 => $value2) {
                    $localObj[$key2] = $value2;
                }
                $this->{$key} = array_merge_recursive($localObj);
            } else if (in_array($key, $this->fields))
                $this->{$key} = $value;
        }
        if (!property_exists($this, 'defconfig_full'))
            $this->defconfig_full = $this->defconfig;
        $this->date = time();
    }

    public function validation()
    {
        $this->validate(
            new InclusionIn(
                array(
                    "field"  => "boot_result",
                    "domain" => array(
                        "PASS",
                        "FAIL",
                        "UNKNOWN"
                    )
                )
            )
        );

        // Check if any messages have been produced
        if ($this->validationHasFailed() == true) {
            return false;
        }
    }
}
?>