<?php
	if (isset($_POST["submit"])) {
		$fname = $_POST['fname'];
		$lname = $_POST['lname'];
        $email = $_POST['email'];
		$message = $_POST['message'];
		$human = intval($_POST['human']);
		$from = 'my ... site'; 
		$to = 'williamm.littler@gmail.com'; 
		$subject = 'Message from my ... site ';
		
		$body = "From: $fname $lname\n E-Mail: $email\n Message:\n $message";
 
		// Check if name has been entered
		if (!$_POST['fname']) {
			$errFname = 'Please enter your first name';
		}
        if (!$_POST['lname']) {
			$errLname = 'Please enter your last name';
		}
		
		// Check if email has been entered and is valid
		if (!$_POST['email'] || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
			$errEmail = 'Please enter a valid email address';
		}
		
		//Check if message has been entered
		if (!$_POST['message']) {
			$errMessage = 'Please enter your message';
		}
		//Check if simple anti-bot test is correct
		if ($human !== 5) {
			$errHuman = 'Your anti-spam is incorrect';
		}
 
// If there are no errors, send the email
if (!$errName && !$errEmail && !$errMessage && !$errHuman) {
	if (mail ($to, $subject, $body, $from)) {
		$result='<div class="alert alert-success">Thank You! I will be in touch</div>';
	} else {
		$result='<div class="alert alert-danger">Sorry there was an error sending your message. Please try again later</div>';
	}
}
	}
?>

    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>PHP Mailer</title>

        <!-- Bootstrap -->
        <link href="css/bootstrap.min.css" rel="stylesheet">

        <!--  Animation    -->
        <link href="css/animate.css" rel="stylesheet" type="text/css">

        <!-- My Stylez -->
        <link href="css/style.css" rel="stylesheet" type="text/css">

        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
        <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    </head>

    <body>
        <div class="container-fluid">

            <div class="row">

                <div class="col-xs-12 col-sm-10 col-sm-offset-1">

                    <form class="form-horizontal" role="form" method="post" action="index.php">
                        <div class="form-group">
                            <label for="fname" class="col-sm-2 control-label">First Name</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="fname" name="fname" placeholder="First Name" value="<?php echo htmlspecialchars($_POST['fname']); ?>">
                                <?php echo "<p class='text-danger'>$errFname</p>";?>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="lname" class="col-sm-2 control-label">Last Name</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="lname" name="lname" placeholder="Last Name" value="<?php echo htmlspecialchars($_POST['lname']); ?>">
                                <?php echo "<p class='text-danger'>$errLname</p>";?>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="email" class="col-sm-2 control-label">Email</label>
                            <div class="col-sm-10">
                                <input type="email" class="form-control" id="email" name="email" placeholder="example@domain.com" value="<?php echo htmlspecialchars($_POST['email']); ?>">
                                <?php echo "<p class='text-danger'>$errEmail</p>";?>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="message" class="col-sm-2 control-label">Message</label>
                            <div class="col-sm-10">
                                <textarea class="form-control" rows="4" name="message">
                                    <?php echo htmlspecialchars($_POST['message']);?>
                                </textarea>
                                <?php echo "<p class='text-danger'>$errMessage</p>";?>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="human" class="col-sm-2 control-label">2 + 3 = ?</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" id="human" name="human" placeholder="Your Answer">
                                <?php echo "<p class='text-danger'>$errHuman</p>";?>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-10 col-sm-offset-2">
                                <input id="submit" name="submit" type="submit" value="Send" class="btn btn-primary">
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-10 col-sm-offset-2">
                                <?php echo $result; ?>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </div>

        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="js/bootstrap.min.js"></script>
    </body>

    </html>