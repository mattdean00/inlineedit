<?php

	$db = new PDO('sqlite:data.sqlite');
	
	class DummyActiveRecord {
		var $content = array();

		function push($data){
			global $db;
			foreach($data as $col=>$val){
				if(strpos($col, '_id')>-1){
					$tbl_lookup_name = str_replace("_id","",$col)."s";
					$lookup_name = str_replace("_id","",$col);
					foreach($db->query("SELECT * FROM $tbl_lookup_name WHERE id = $val")->fetchAll(PDO::FETCH_CLASS) as $row){
						$data->$lookup_name = $row;
					}
				}
			}
			array_push($this->content, $data);
		}
		function json(){
			return json_encode($this->content);
		}
		function data(){
			return $this->content;
		}
		
	}
	
	if(!isset($_REQUEST["action"]))
		die('Please specify action');
		//$action = 'index';
	else
		$action = $_REQUEST['action'];
	
	switch($action){
		case "index":
			$r = new DummyActiveRecord();
			foreach($db->query('SELECT * FROM records')->fetchAll(PDO::FETCH_CLASS) as $i=>$row){
				$r->push($row);
			}
			echo $r->json();
			break;
		case "save":
			try{
				file_put_contents("uploads/".$_POST['file'], base64_decode($_POST['file64']));		
			}catch(Exception $ex){
				die($ex);
			}
			if(empty($_POST['id'])){
				$sql = "INSERT INTO records (text, number, file, select_id) VALUES (
					'".$_POST['text']."',
					".$_POST['number']." ,
					'".$_POST['file']."',
					".$_POST['select_id']." )";
			}else{
				$sql = "UPDATE records SET
							text = '".$_POST['text']."',
							number = ".$_POST['number'].", 
							file= 'uploads/".$_POST['file']."',
							select_id=".$_POST['select_id']."
						WHERE id = ".$_POST['id'];
			}
			if(!$result = $db->exec($sql)){
				print_r($db->errorInfo());die($sql);
			}else{
				echo 'SUCCESS';
			}
			break;
		case "delete":
			break;
		default: 
			die("Nothing to do here!");
			break;
	}
	
	$db = null;

?>